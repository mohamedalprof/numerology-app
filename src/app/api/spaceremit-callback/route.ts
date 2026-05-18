import { NextRequest, NextResponse } from "next/server";

// ============================================
// 🔐 SPACEREMIT CALLBACK ENDPOINT
// This endpoint receives payment notifications from Spaceremit server.
// It verifies payment authenticity using the Secret Key.
// ============================================

// Payment status store (in production, use a database)
const paymentStore: Record<string, { status: string; amount: number; currency: string; timestamp: number }> = {};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🔔 Spaceremit Callback Received:", JSON.stringify(body, null, 2));

    // ============================================
    // 1. Extract payment data from Spaceremit payload
    // ============================================
    const {
      spaceremit_code,      // Unique payment code from Spaceremit
      status,               // Payment status (e.g., "completed", "failed")
      amount,               // Payment amount
      currency,             // Payment currency (e.g., "USD")
      sp_secret_key,        // Secret key sent by Spaceremit for verification
      custom_id,            // Custom ID if you passed one
    } = body;

    // ============================================
    // 2. Verify the Secret Key
    // This ensures the callback is genuinely from Spaceremit
    // ============================================
    const expectedSecretKey = process.env.SPACEREMIT_SECRET_KEY;

    if (!expectedSecretKey) {
      console.error("❌ SPACEREMIT_SECRET_KEY not configured in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (sp_secret_key !== expectedSecretKey) {
      console.error("❌ Invalid secret key in callback. Possible fraud attempt!");
      return NextResponse.json(
        { error: "Invalid authentication" },
        { status: 403 }
      );
    }

    // ============================================
    // 3. Verify the payment amount
    // ============================================
    const expectedAmount = Number(process.env.SPACEREMIT_AMOUNT || "5");
    const expectedCurrency = process.env.SPACEREMIT_CURRENCY || "USD";

    if (Number(amount) !== expectedAmount) {
      console.error(`❌ Amount mismatch: expected ${expectedAmount}, got ${amount}`);
      return NextResponse.json(
        { error: "Amount mismatch" },
        { status: 400 }
      );
    }

    if (currency !== expectedCurrency) {
      console.error(`❌ Currency mismatch: expected ${expectedCurrency}, got ${currency}`);
      return NextResponse.json(
        { error: "Currency mismatch" },
        { status: 400 }
      );
    }

    // ============================================
    // 4. Process the payment based on status
    // ============================================
    if (status === "completed" || status === "successful") {
      console.log(`✅ Payment COMPLETED - Code: ${spaceremit_code}, Amount: ${amount} ${currency}`);

      // Store the successful payment
      paymentStore[spaceremit_code] = {
        status: "completed",
        amount: Number(amount),
        currency: currency,
        timestamp: Date.now(),
      };

      // In production, you would:
      // - Save to database (Prisma, etc.)
      // - Send email notification
      // - Update user subscription status
      // - Log the transaction

    } else if (status === "failed" || status === "cancelled") {
      console.log(`❌ Payment FAILED - Code: ${spaceremit_code}, Status: ${status}`);

      paymentStore[spaceremit_code] = {
        status: "failed",
        amount: Number(amount),
        currency: currency,
        timestamp: Date.now(),
      };

    } else {
      console.log(`ℹ️ Payment status: ${status} - Code: ${spaceremit_code}`);

      paymentStore[spaceremit_code] = {
        status: status,
        amount: Number(amount),
        currency: currency,
        timestamp: Date.now(),
      };
    }

    // ============================================
    // 5. Respond with 200 OK
    // Spaceremit expects a 200 response to confirm receipt
    // ============================================
    return NextResponse.json({
      received: true,
      spaceremit_code: spaceremit_code,
      status: status,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error processing Spaceremit callback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ============================================
// GET endpoint to verify payment status
// The frontend can check if a payment was verified server-side
// ============================================
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing payment code" }, { status: 400 });
  }

  const payment = paymentStore[code];

  if (!payment) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    spaceremit_code: code,
    ...payment,
  }, { status: 200 });
}
