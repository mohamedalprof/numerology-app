'use client'

import { useState, useCallback, useEffect } from 'react'
import { sumDigits, reduceNumber, getCategory, POSITIVE_NUMBERS, NEGATIVE_NUMBERS, MEDIUM_NUMBERS } from '@/lib/numerology'

// ============================================
// 🔑 SPACEREMIT CONFIGURATION
// ⚠️ استبدل YOUR_PUBLIC_KEY بالمفتاح العام الذي ستصلك من Spaceremit
// ============================================
const SP_PUBLIC_KEY = process.env.NEXT_PUBLIC_SPACEREMIT_PUBLIC_KEY || "pkY0983WL196EGJHJ05WM06ORG6EXFTNZ1RHI543ZEQBCSO33XAX"; // ← المفتاح العام من Spaceremit
const SP_AMOUNT = Number(process.env.NEXT_PUBLIC_SPACEREMIT_AMOUNT || "5"); // ← سعر الخدمة بالدولار
const SP_CURRENCY = process.env.NEXT_PUBLIC_SPACEREMIT_CURRENCY || "USD"; // ← العملة
const SP_FORM_ID = "#spaceremit-form";
const SP_SELECT_RADIO_NAME = "sp-pay-type-radio";
const LOCAL_METHODS_BOX_STATUS = true;
const LOCAL_METHODS_PARENT_ID = "#spaceremit-local-methods-pay";
const CARD_BOX_STATUS = true;
const CARD_BOX_PARENT_ID = "#spaceremit-card-pay";
let SP_FORM_AUTO_SUBMIT_WHEN_GET_CODE = true;
// ============================================

const translations = {
  ar: {
    langToggle: 'English',
    brandName: 'أعداد وبصيرة',
    brandSub: 'AI Numerical Insight',
    heroTitle: 'هل نحن مناسبون لبعضنا البعض؟',
    heroDesc: 'دعي خوارزميات <span class="highlight-cyan">الذكاء الاصطناعي</span> تحلل طاقة الأرقام القديمة. أدخلي تواريخ الميلاد <span class="highlight-amber">بدون أصفار</span> واتركي البصيرة الرقمية تكشف الغيب.',
    user1Label: 'USER 01',
    user1Icon: '♀',
    user2Label: 'USER 02',
    user2Icon: '♂',
    dobLabel: 'DATE OF BIRTH',
    name1Placeholder: 'اسمكِ',
    name2Placeholder: 'اسم شريككِ',
    dayPlaceholder: 'يوم',
    monthPlaceholder: 'شهر',
    yearPlaceholder: 'سنة',
    calcBtnText: 'بدء التحليل الآلي',
    compatIndexLabel: 'COMPATIBILITY INDEX',
    closingPhrase: 'ودائماً نقول العلم عند الله وحده، أتمنى لكم حياة مليئة بالوُد و الإحترام.',
    paywallText: 'كيف تعالجون علاقتكم؟ وكيف عملت الخوارزمية؟ افتحوا القسم المميز!',
    subscribeBtnText: 'اكشفي السر مقابل 5$',
    calcTabBtn: 'طريقة الحساب',
    healTabBtn: 'دليل الشفاء العاطفي 🌿',
    shareBtn: 'مشاركة النتيجة',
    paymentTitle: 'اشتراك البصيرة السرية',
    paymentDesc: 'لفتح قسم "طريقة الحساب" و"دليل الشفاء العاطفي"، يرجى الدفع مبلغ 5$ عبر بوابة Spaceremit:',
    paymentNote: 'بعد الدفع، سيتم فتح القسم المميز لكِ تلقائياً.',
    confirmPaymentText: 'لقد قمت بالدفع',
    closeModalBtn: 'إغلاق',
    alertFillFields: 'يرجى ملء جميع الحقول',
    namesSeparator: 'و',
    positiveBadge: '✓ توافق إيجابي',
    mediumBadge: '⚠ توافق متوسط',
    negativeBadge: '✗ توافق سلبي ⚠',
    shareText: (name1: string, name2: string, result: number) =>
      `أنا و ${name2} لدينا مؤشر توافق ${result} 💕 جرب أنت أيضاً على أعداد وبصيرة!`,
    paymentSuccessTitle: 'تم الدفع بنجاح!',
    paymentSuccessMsg: 'تم فتح القسم المميز لكِ. استمتعي بالبصيرة السرية!',
    paymentFailTitle: 'فشل الدفع',
    paymentFailMsg: 'لم يتم إتمام عملية الدفع. يرجى المحاولة مرة أخرى.',
  },
  en: {
    langToggle: 'العربية',
    brandName: 'Numbers & Insight',
    brandSub: 'AI Numerology Calculator',
    heroTitle: 'Are We Compatible?',
    heroDesc: 'Let <span class="highlight-cyan">Artificial Intelligence</span> analyze the energy of ancient numbers. Enter your birth dates <span class="highlight-amber">without zeros</span> and let numerical insight reveal the truth.',
    user1Label: 'USER 01',
    user1Icon: '♀',
    user2Label: 'USER 02',
    user2Icon: '♂',
    dobLabel: 'DATE OF BIRTH',
    name1Placeholder: 'Your Name',
    name2Placeholder: "Partner's Name",
    dayPlaceholder: 'Day',
    monthPlaceholder: 'Month',
    yearPlaceholder: 'Year',
    calcBtnText: 'Start Automated Analysis',
    compatIndexLabel: 'COMPATIBILITY INDEX',
    closingPhrase: 'Remember, knowledge belongs to God alone. We wish you a life full of affection and respect.',
    paywallText: 'How do you treat your relationship? How does the algorithm work? Unlock the premium section!',
    subscribeBtnText: 'Reveal the Secret for $5',
    calcTabBtn: 'Calculation Method',
    healTabBtn: 'Emotional Healing Guide 🌿',
    shareBtn: 'Share Result',
    paymentTitle: 'Secret Insight Subscription',
    paymentDesc: 'To unlock "Calculation Method" and "Emotional Healing Guide", please pay $5 via Spaceremit gateway:',
    paymentNote: 'After payment, the premium section will be unlocked automatically.',
    confirmPaymentText: 'I Have Paid',
    closeModalBtn: 'Close',
    alertFillFields: 'Please fill all fields',
    namesSeparator: '&',
    positiveBadge: '✓ Positive Compatibility',
    mediumBadge: '⚠ Moderate Compatibility',
    negativeBadge: '✗ Negative Compatibility ⚠',
    shareText: (name1: string, name2: string, result: number) =>
      `${name1} and ${name2} have a compatibility index of ${result} 💕 Try it too on Numbers & Insight!`,
    paymentSuccessTitle: 'Payment Successful!',
    paymentSuccessMsg: 'Premium section unlocked. Enjoy the secret insight!',
    paymentFailTitle: 'Payment Failed',
    paymentFailMsg: 'Payment was not completed. Please try again.',
  }
}

const interpretations: Record<number, string> = {
  1: "في مثل هذه العلاقة ستكون دائماً مسألة القيادة على شخص ما، عادة سيسعى لإدارة العلاقة، لفرض إرادتهم وقوانينهم ما يكون دائماً هو الرجل. حاول ألا تتدخل في هذا الأمر، ما هو جيد يكون: الإبداع، المثير للاهتمام، الكثير يعتمد على موقف الشركاء، الكثير يمكن أن يتغير. قد تكون خاطب / مخطوبة في العمل المشترك.",
  2: "علاقة لينة و متناغمة القرابة، هل أنت في لمحة فهم بعضنا البعض. كل من الشركاء في العالم الغني، وهو خيال قوي. هذا هو موقف موات للغاية.",
  3: "علاقة جيدة، والتي غالباً ما تؤدي إلى الزواج، قد يكون ولادة طفل. العلاقات التي تجلب المال والاستقرار. ومع ذلك، لا تدع الأشخاص الآخرين بالتدخل في حياتك، وخاصة الأم، سوف يلعب هذا التحالف دوراً رئيسياً.",
  4: "العلاقة، التي يلعب فيها الدور الرئيسي من قبل رجل، الكثير من العاطفة و العواطف. لا تدع الغيرة تدمر كل شيء، هل تريد امتلاك مفضلتك بالكامل، وهذا هو الأنانية، لا تدع القيل والقال تدمر الاتحاد الخاص بك.",
  5: "تحالف مهم في حياتك. هذا الشخص سوف يلعب دوراً هاماً. يمكن أن تتداخل مع الاختلافات الاجتماعية، أو اختلاف الاهتمامات، ووجهات النظر في الحياة، سيكون شريكك معلمك ومستشارك. أو سوف تصبح نجماً إرشادياً.",
  6: "الأكثر انسجاماً من جميع النقابات. هذا هو أقل الزيجات. الحب المتبادل والوئام والسلام. ومع ذلك، قد يكون من الصعب في البداية فهم كل منهما للآخر بشكل كامل لا تقلق، كل شيء يأتي مع الوقت.",
  7: "علاقة مؤثرة جداً، الكثير من التغيير، السفر، التواصل. الكثير من التقلبات. قد يكون هناك غش، عادة ما تنتهي هذه العلاقات بسرعة. خذ وقتك في اتخاذ قرارات مهمة حول حبيبك، لأن هناك فرصة كبيرة للخطأ.",
  8: "هو تحالف تجاري وليس حباً، أو - العلاقات الكرمية. في الحياة الماضية كنتما مذنبين إتجاه بعضكم البعض. في هذه الحياة عليك أن تعمل على إصلاح أخطائك، مثل هذه العلاقات يصعب كسرها. علينا أن نعمل على أنفسنا، ليس من الضروري تغيير الشريك.",
  9: "العلاقة المعقدة - كل واحدة على حدى. قد تشعر بالوحدة في هذا الاتحاد. عدم المودة والانتباه والدفء هذا التحالف يتفكك في نهاية المطاف، وهو أيضاً حب في اتجاه واحد تحب وأنت لا! أو العكس.",
  10: "علاقة سعيدة جداً. وسوف تجلب النجاح والحظ السعيد. أرسل هذا الإنسان إلى حياتك كحبل نجاة، أنه يوسع آفاق قدرتك، قد تكون هذه أيضاً علاقة ملائمة. على أية حال، سوف ينتهي كل شيء بشكل جيد.",
  11: "العلاقة المعقدة. كلا الشريكين هما شخصية قوية للغاية. الجميع يحاول الهيمنة. ومن هنا النزاع والشقاق، يمكن أن تتداخل مع طرف ثالث. خيانة. تحتاج إلى التكيف مع بعضهم البعض، لتقديم تنازلات، وإلا فإن العلاقة تنهار، جيد جداً التوافق في الجنس.",
  12: "سوف تذهب جهداً كبيراً من أجل العلاقة. إنها دائماً تضحية، يمكنك وضع الكثير بسبب حبك، هذه علاقات معقدة، كرمية، مشاعر غير متكررة، استياء، سوء فهم، هذه العلاقات ستترك انطباعاً عميقاً في ذهنك.",
  13: "الاتحاد سيء، عاجلاً أم آجلاً سوف ينهار مثل بيت بطاقات - هناك عدم توافق في الطاقة بين الشركاء. علاقة خطرة. ممكن العنف في الزواج.",
  14: "علاقات هادئة و سلسة، هذا هو واحد من أفضل الخيارات للتوافق، أنت تفهم بعضكما البعض، لديك أهداف مشتركة ومصالح مشتركة، علاقة طويلة ومستقرة.",
  15: "خطر! مثل هذا التحالف مبني على التلاعب و الابتزاز. شخص ما ربط الآخر من الشركاء. إدمان جنسي قوي. تحريف. السحر الأسود، تلاعب!",
  16: "حاول عدم ربط الحياة مع هذا الرجل. علاقات غير مستقرة للغاية، ثابت الشتائم، الشجار. النتيجة = الطلاق، أنت غير مناسب لكل دائرة، نسبة المخاطر لكلا الشريكين. يمكن أن تكون عالية.",
  17: "لها تأثير قوي في محبتهم. إمتصاص طاقتهم، الاتحاد المثالي، كنت تكملا بعضكم البعض بشكل جيد. أرسل لك رجل الملاك الوصي، مستقبل عظيم. شريك لك في كل شيء.",
  18: "الكثير من المفاهيم الخاطئة والأوهام في العلاقة. أنت لم تحصل على الأشخاص الجيدين من حولك، خيانة، خطر إختيار مثل هذا الشخص، لا يمكنك إستخدام السحر لإصلاح هذه العلاقة.",
  19: "جيد. دافئة و متناغمة، ولادة أطفال أصحاء و سعداء، الحب الحقيقي، الفهم. الدعم.",
  20: "في الخطوة الأولى، يمكن أن تكون العلاقة معقدة للغاية. سوف تتكيف مع بعضهم البعض. ومع ذلك، فإن المشكلة تختفي بسرعة كبيرة وأنتم على الطريق. ستكون هناك مشاعر قوية عموماً، هذه علاقة جيدة. الشيء الرئيسي لإعطاء الوقت لتعتاد على بعضهم البعض. (هذه صداقة مخلصة).",
  21: "السلام والسلام والسلام. زواج قوي. جدي. رعاية بعضهم البعض، توافق كبير للطاقة.",
  22: "علاقة غير متوقعة جداً، العطش للحرية، قد يكون شريكك رجلاً غير عادي جداً. هذا البركان الذي يمكن أن ينفجر في أي لحظة بسبب التراكمات، أنتم بحاجة إلى العمل الجاد لجعل هذه العلاقات سلسة وهادئة. من المرجح أن يكون المصير الطلاق."
}

// Classification constants imported from @/lib/numerology

const healingGuides: Record<number, string> = {
  1: "حاول ألا تتدخل في مسألة القيادة. ركزي على الإبداع وبناء شراكة متساوية. قد تكونوا خاطب/مخطوبة في العمل المشترك.",
  2: "استمتع بهدوء هذه العلاقة. ركز على بناء الثقة والتواصل الصادق. هذه العلاقة تحتاج إلى الرعاية والاهتمام المستمر.",
  3: "احتفل بهذا التوافق الرائع. ركز على بناء مستقبل مشترك. تجنب تدخل الآخرين في حياتكما الخاصة وخاصة الأم.",
  4: "تعامل مع الغيرة بحكمة. ركز على بناء الثقة والأمان في العلاقة. اعطي شريكك الحرية والاستقلالية.",
  5: "تعلم من هذه العلاقة. اقبل الاختلافات وركز على النقاط المشتركة. هذا الشخص سيساعدك على النمو والتطور.",
  6: "استمتع بهذا الانسجام الرائع. ركز على تعميق الحب والفهم المتبادل. هذه العلاقة ستستمر وتزدهر.",
  7: "كن حذراً من التقلبات. ركز على الاستقرار والتواصل الصادق. لا تسرع في اتخاذ القرارات المهمة.",
  8: "اعمل على نفسك وعلى العلاقة. هذه علاقة كرمية تحتاج إلى الصبر والفهم. ركز على الشفاء والنمو الروحي.",
  9: "ركزي على الاتصال العاطفي. حاولي فهم احتياجات شريكك. قد تحتاجين إلى طلب المساعدة من متخصص.",
  10: "استمتع بهذا الحظ السعيد. ركز على تعميق الحب والفهم المتبادل. هذه العلاقة ستجلب السعادة والنجاح.",
  11: "تعامل مع الصراعات بحكمة. ركز على التواصل والتفاهم المتبادل وتقديم التنازلات. قد تحتاج إلى طلب المساعدة من متخصص.",
  12: "كوني صبورة وقوية. هذه العلاقة تحتاج إلى الكثير من الجهد والتضحية. ركزي على الحب والالتزام.",
  13: "كوني حذرة جداً. قد تحتاجين إلى إعادة النظر في هذه العلاقة. اطلبي المساعدة والدعم من الأشخاص الموثوقين.",
  14: "استمتع بهذا الاستقرار والسلام. ركز على بناء حياة مشتركة سعيدة. هذه العلاقة ستستمر وتزدهر.",
  15: "كوني حذرة جداً من التلاعب والابتزاز. اطلبي المساعدة الفورية من متخصص أو من الأشخاص الموثوقين.",
  16: "أعيدي النظر في هذه العلاقة بجدية. حاول عدم ربط الحياة مع هذا الرجل. نسبة المخاطر عالية جداً.",
  17: "استمتع بهذا الاتحاد المثالي. أنتما تكملان بعضكما البعض بشكل جيد. ركزي على بناء مستقبل عظيم مع شريكك.",
  18: "كوني حذرة من المفاهيم الخاطئة والأوهام. لا يمكنك إستخدام السحر لإصلاح هذه العلاقة. أعيدي النظر في إختيارك.",
  19: "احتفل بهذا التوافق الدافئ. ركز على بناء أسعة سعيدة مع أطفال أصحاء. هذه العلاقة مليئة بالحب الحقيقي والدعم.",
  20: "أعطي الوقت لتعتادا على بعضكما البعض. في البداية معقدة لكن المشاكل تختفي بسرعة. هذه صداقة مخلصة وعلاقة جيدة.",
  21: "احتفل بهذا السلام والانسجام. زواج قوي وجدي. ركز على رعاية بعضكم البعض والحفاظ على توافق الطاقة.",
  22: "كوني حذرة جداً. هذا البركان يمكن أن ينفجر في أي لحظة. العمل الجاد مطلوب لجعل العلاقة هادئة. من المرجح أن يكون المصير الطلاق."
}

// ============================================
// Spaceremit Callback Functions (Global)
// These must be on window for the Spaceremit SDK to call them
// ============================================
declare global {
  interface Window {
    SP_SUCCESSFUL_PAYMENT: (code: string) => void;
    SP_FAILD_PAYMENT: () => void;
    SP_RECIVED_MESSAGE: (message: string) => void;
    SP_NEED_AUTH: (targetAuthLink: string) => void;
  }
}

export default function Home() {
  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('lang') as 'ar' | 'en') || 'ar'
    }
    return 'ar'
  })
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [day1, setDay1] = useState('')
  const [month1, setMonth1] = useState('')
  const [year1, setYear1] = useState('')
  const [day2, setDay2] = useState('')
  const [month2, setMonth2] = useState('')
  const [year2, setYear2] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultNumber, setResultNumber] = useState(0)
  const [activeTab, setActiveTab] = useState<'calc' | 'heal'>('calc')
  const [showModal, setShowModal] = useState(false)
  const [premiumUnlocked, setPremiumUnlocked] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('premium_unlocked') === 'true'
    }
    return false
  })
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle')

  const t = translations[currentLang]

  // ============================================
  // Setup Spaceremit callbacks on window
  // ============================================
  useEffect(() => {
    // Spaceremit SDK callback: successful payment
    window.SP_SUCCESSFUL_PAYMENT = (spaceremit_code: string) => {
      console.log('Spaceremit payment successful:', spaceremit_code)
      setPremiumUnlocked(true)
      setPaymentStatus('success')
      setShowModal(false)
      localStorage.setItem('premium_unlocked', 'true')
      localStorage.setItem('spaceremit_code', spaceremit_code)
    }

    // Spaceremit SDK callback: failed payment
    window.SP_FAILD_PAYMENT = () => {
      console.log('Spaceremit payment failed')
      setPaymentStatus('failed')
    }

    // Spaceremit SDK callback: received message
    window.SP_RECIVED_MESSAGE = (message: string) => {
      alert(message)
    }

    // Spaceremit SDK callback: needs authentication
    window.SP_NEED_AUTH = (target_auth_link: string) => {
      window.open(target_auth_link, '_blank')
    }
  }, [])

  const toggleLanguage = useCallback(() => {
    const newLang = currentLang === 'ar' ? 'en' : 'ar'
    setCurrentLang(newLang)
    localStorage.setItem('lang', newLang)
    const html = document.documentElement
    html.setAttribute('lang', newLang)
    html.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr')

    // Reinitialize Spaceremit form when language changes
    // This ensures payment options (including wallet) render correctly in both languages
    if (typeof window !== 'undefined' && (window as any).SpaceremitPay) {
      try {
        const localContainer = document.getElementById('spaceremit-local-methods-pay')
        const cardContainer = document.getElementById('spaceremit-card-pay')
        if (localContainer) localContainer.innerHTML = ''
        if (cardContainer) cardContainer.innerHTML = ''
        // Re-initialize Spaceremit SDK after a short delay
        setTimeout(() => {
          if (typeof (window as any).SpaceremitPay === 'function') {
            ;(window as any).SpaceremitPay()
          }
        }, 300)
      } catch (e) {
        console.log('Spaceremit re-init after language change:', e)
      }
    }
  }, [currentLang])

  // Calculation functions imported from @/lib/numerology
  // sumDigits, reduceNumber, getCategory are now shared between page and tests

  const getBadgeText = (category: string) => {
    if (category === 'positive') return t.positiveBadge
    if (category === 'medium') return t.mediumBadge
    return t.negativeBadge
  }

  const calculateCompatibility = useCallback(() => {
    const d1 = parseInt(day1) || 0
    const m1 = parseInt(month1) || 0
    const y1 = parseInt(year1) || 0
    const d2 = parseInt(day2) || 0
    const m2 = parseInt(month2) || 0
    const y2 = parseInt(year2) || 0

    if (!name1 || !d1 || !m1 || !y1 || !name2 || !d2 || !m2 || !y2) {
      alert(t.alertFillFields)
      return
    }

    setLoading(true)

    setTimeout(() => {
      const sum1 = sumDigits(d1) + sumDigits(m1) + sumDigits(y1)
      const sum2 = sumDigits(d2) + sumDigits(m2) + sumDigits(y2)
      const totalSum = sum1 + sum2
      const compatibility = reduceNumber(totalSum)

      setResultNumber(compatibility)
      setShowResult(true)
      setLoading(false)
    }, 1500)
  }, [name1, name2, day1, month1, year1, day2, month2, year2, t])

  const shareResult = useCallback(() => {
    const text = t.shareText(name1, name2, resultNumber)
    if (navigator.share) {
      navigator.share({
        title: currentLang === 'ar' ? 'أعداد وبصيرة' : 'Numbers & Insight',
        text: text,
        url: window.location.href
      })
    } else {
      alert(text)
    }
  }, [t, name1, name2, resultNumber, currentLang])

  const handleSubscribe = useCallback(() => {
    setShowModal(true)
    // Initialize Spaceremit form when modal opens
    // This ensures the wallet option and other payment methods render correctly
    setTimeout(() => {
      if (typeof window !== 'undefined' && typeof (window as any).SpaceremitPay === 'function') {
        try {
          ;(window as any).SpaceremitPay()
        } catch (e) {
          console.log('Spaceremit init on modal open:', e)
        }
      }
    }, 500)
  }, [])

  const category = getCategory(resultNumber)
  const badgeText = getBadgeText(category)

  return (
    <>
      {/* Spaceremit Configuration Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            const SP_PUBLIC_KEY = "${SP_PUBLIC_KEY}";
            const SP_FORM_ID = "${SP_FORM_ID}";
            const SP_SELECT_RADIO_NAME = "${SP_SELECT_RADIO_NAME}";
            const LOCAL_METHODS_BOX_STATUS = ${LOCAL_METHODS_BOX_STATUS};
            const LOCAL_METHODS_PARENT_ID = "${LOCAL_METHODS_PARENT_ID}";
            const CARD_BOX_STATUS = ${CARD_BOX_STATUS};
            const CARD_BOX_PARENT_ID = "${CARD_BOX_PARENT_ID}";
            let SP_FORM_AUTO_SUBMIT_WHEN_GET_CODE = ${SP_FORM_AUTO_SUBMIT_WHEN_GET_CODE};
          `
        }}
      />

      {/* Background */}
      <div className="bg-animation">
        <div className="digital-grid"></div>
        <div className="stars"></div>
      </div>

      {/* Language Toggle */}
      <button className="language-toggle" onClick={toggleLanguage}>
        {t.langToggle}
      </button>

      {/* Navbar */}
      <nav>
        <div className="logo-container">
          <div className="logo-icon">
            <div className="logo-circle">
              <span className="logo-number">22</span>
            </div>
          </div>
          <div className="brand-name">
            {currentLang === 'ar' ? (
              <span>أعداد وبصيرة</span>
            ) : (
              <span style={{ fontFamily: "'Orbitron', sans-serif" }}>Numbers & Insight</span>
            )}
          </div>
          <div className="brand-name-en">
            {currentLang === 'ar' ? 'AI Numerical Insight' : 'AI Numerology Calculator'}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <div className="hero">
          <h1>{t.heroTitle}</h1>
          <p dangerouslySetInnerHTML={{ __html: t.heroDesc }} />
        </div>

        <div className="calculator-box">
          {/* Person 1 */}
          <div className="person-inputs">
            <div className="input-group">
              <label>
                <i className="fas fa-female"></i> {t.user1Label}
              </label>
              <input
                type="text"
                value={name1}
                onChange={(e) => setName1(e.target.value)}
                placeholder={t.name1Placeholder}
              />
            </div>
            <div className="input-group">
              <label>{t.dobLabel}</label>
              <div className="input-row">
                <input
                  type="number"
                  value={day1}
                  onChange={(e) => setDay1(e.target.value)}
                  placeholder={t.dayPlaceholder}
                  min={1}
                  max={31}
                />
                <input
                  type="number"
                  value={month1}
                  onChange={(e) => setMonth1(e.target.value)}
                  placeholder={t.monthPlaceholder}
                  min={1}
                  max={12}
                />
                <input
                  type="number"
                  value={year1}
                  onChange={(e) => setYear1(e.target.value)}
                  placeholder={t.yearPlaceholder}
                  min={1940}
                  max={2010}
                />
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div className="person-inputs" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
            <div className="input-group">
              <label>
                <i className="fas fa-male"></i> {t.user2Label}
              </label>
              <input
                type="text"
                value={name2}
                onChange={(e) => setName2(e.target.value)}
                placeholder={t.name2Placeholder}
              />
            </div>
            <div className="input-group">
              <label>{t.dobLabel}</label>
              <div className="input-row">
                <input
                  type="number"
                  value={day2}
                  onChange={(e) => setDay2(e.target.value)}
                  placeholder={t.dayPlaceholder}
                  min={1}
                  max={31}
                />
                <input
                  type="number"
                  value={month2}
                  onChange={(e) => setMonth2(e.target.value)}
                  placeholder={t.monthPlaceholder}
                  min={1}
                  max={12}
                />
                <input
                  type="number"
                  value={year2}
                  onChange={(e) => setYear2(e.target.value)}
                  placeholder={t.yearPlaceholder}
                  min={1940}
                  max={2010}
                />
              </div>
            </div>
          </div>

          <button
            className={`btn-calculate ${loading ? 'loading' : ''}`}
            onClick={calculateCompatibility}
          >
            {t.calcBtnText} <i className="fas fa-microchip"></i>
            <div className="spinner"></div>
          </button>
        </div>

        {/* Results */}
        {showResult && (
          <div className="result-section">
            <div className="result-card">
              <div className="scan-line"></div>
              <div className="result-content">
                <div className="names-display">
                  {name1} {t.namesSeparator} {name2}
                </div>
                <div className="compat-index-label">{t.compatIndexLabel}</div>
                <div className="compatibility-number">{resultNumber}</div>
                <div className={`category-badge cat-${category}`}>{badgeText}</div>
                <div className="interpretation-text">
                  {interpretations[resultNumber] || 'نتيجة غير متوقعة'}
                </div>
                <div className="closing-phrase">{t.closingPhrase}</div>

                {/* Payment Success/Fail Messages */}
                {paymentStatus === 'success' && (
                  <div style={{
                    background: 'rgba(0, 255, 200, 0.15)',
                    border: '1px solid var(--neon-cyan)',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <i className="fas fa-check-circle" style={{ color: 'var(--neon-cyan)', fontSize: '2rem' }}></i>
                    <p style={{ color: 'var(--neon-cyan)', marginTop: '0.5rem', fontWeight: 'bold' }}>
                      {t.paymentSuccessTitle}
                    </p>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      {t.paymentSuccessMsg}
                    </p>
                  </div>
                )}
                {paymentStatus === 'failed' && (
                  <div style={{
                    background: 'rgba(90, 30, 20, 0.4)',
                    border: '1px solid var(--negative-border)',
                    borderRadius: '10px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <i className="fas fa-times-circle" style={{ color: 'var(--negative-text)', fontSize: '2rem' }}></i>
                    <p style={{ color: 'var(--negative-text)', marginTop: '0.5rem', fontWeight: 'bold' }}>
                      {t.paymentFailTitle}
                    </p>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                      {t.paymentFailMsg}
                    </p>
                  </div>
                )}

                {/* Premium Section */}
                <div className={`paywall-section ${premiumUnlocked ? 'premium-unlocked' : ''}`}>
                  {!premiumUnlocked && (
                    <div className="paywall-overlay">
                      <i className="fas fa-lock lock-icon"></i>
                      <div className="paywall-text">{t.paywallText}</div>
                      <button className="btn-subscribe" onClick={handleSubscribe}>
                        {t.subscribeBtnText}
                      </button>
                    </div>
                  )}

                  <div className="paywall-content">
                    <div className="tabs">
                      <button
                        className={`tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
                        onClick={() => setActiveTab('calc')}
                      >
                        {t.calcTabBtn}
                      </button>
                      <button
                        className={`tab-btn ${activeTab === 'heal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('heal')}
                      >
                        {t.healTabBtn}
                      </button>
                    </div>

                    <div className={`tab-content ${activeTab === 'calc' ? 'active' : ''}`}>
                      <p><strong>الخطوة 1:</strong> نقوم بجمع كل أرقام تواريخ الميلاد معاً (بدون أصفار).</p>
                      <p>مثال: 1+2+9+1+9+7+0+2+1+2+1+9+6+8 = 58</p>
                      <br />
                      <p><strong>الخطوة 2:</strong> نقوم بطرح الرقم 22 بشكل متكرر حتى نحصل على رقم أقل من 22.</p>
                      <p>مثال: 58 - 22 = 36<br />36 - 22 = 14</p>
                      <br />
                      <p><strong>النتيجة:</strong> الرقم النهائي (14) هو مؤشر التوافق الخاص بكما!</p>
                    </div>

                    <div className={`tab-content ${activeTab === 'heal' ? 'active' : ''}`}>
                      <p>{healingGuides[resultNumber] || 'نصيحة غير متوفرة'}</p>
                    </div>
                  </div>
                </div>

                <button className="btn-share" onClick={shareResult}>
                  <i className="fas fa-share-alt"></i> {t.shareBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Payment Modal with Spaceremit Form */}
      <div className={`modal-bg ${showModal ? 'active' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setShowModal(false)
      }}>
        <div className="modal-content">
          <h3 style={{ color: 'var(--amber)', marginBottom: '1rem' }}>{t.paymentTitle}</h3>

          {/* ============================================
              🔑 SPACEREMIT PAYMENT FORM
              This form integrates with Spaceremit payment gateway.
              When SP_PUBLIC_KEY is set, it will show Spaceremit payment options.
              ============================================ */}
          <form id="spaceremit-form" style={{ width: '100%' }}>
            {/* Spaceremit: Price & Currency (hidden fields) */}
            <input type="hidden" name="amount" value={SP_AMOUNT} />
            <input type="hidden" name="currency" value={SP_CURRENCY} />

            {/* Spaceremit Local Payment Methods Container */}
            <div id="spaceremit-local-methods-pay" style={{ marginBottom: '1rem' }}></div>

            {/* Spaceremit Card Payment Container */}
            <div id="spaceremit-card-pay" style={{ marginBottom: '1rem' }}></div>
          </form>

          <br />
          <button className="btn-close-modal" onClick={() => setShowModal(false)}>
            {t.closeModalBtn}
          </button>
        </div>
      </div>
    </>
  )
}
