'use client'

import { useState, useCallback, useEffect } from 'react'
import { sumDigits, reduceNumber, getCategory, POSITIVE_NUMBERS, NEGATIVE_NUMBERS, MEDIUM_NUMBERS } from '@/lib/numerology'

// ============================================
// 🔑 SPACEREMIT CONFIGURATION
// ⚠️ استبدل YOUR_PUBLIC_KEY بالمفتاح العام الذي ستصلك من Spaceremit
// ============================================
const SP_PUBLIC_KEY = "test_pkEWKABMA8ACO5SWCQ6CF64M9ILOVDEZGDXOOFM82MZSKYGN90BZ"; // ← مفتاح Spaceremit التجريبي (Test Mode)
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
    waTooltip: 'تواصل معنا',
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
    waTooltip: 'Contact Us',
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
  1: "هذه العلاقة تحمل طاقة القيادة والسيطرة، حيث يسعى أحد الطرفين دائماً لفرض إرادته وقوانينه على الآخر. عادةً ما يكون الرجل هو من يبحث عن التحكم في مسار العلاقة، وهذا قد يخلق توتراً مستمراً إذا لم يتم التعامل معه بحكمة. التحدي الأكبر هنا هو كيفية التوافق بين شخصيتين كل منهما يريد أن يكون صاحب الكلمة الأولى. النصيحة الذهبية في هذا الترقيم هي ألا تتدخلي في صراع القيادة بشكل مباشر، بل استخدمي الذكاء العاطفي لتوجيه العلاقة بشكل غير مباشر. ركزي طاقتك على الإبداع وبناء شراكة متساوية تقوم على الاحترام المتبادل وليس التنافس. هذه العلاقة قد تكون مثمرة جداً إذا استطعتم تحويل طاقة الصراع إلى طاقة إبداعية مشتركة. قد تجدون أنفسكم شركاء في عمل مشترك أو مشروع إبداعي يجمع بين مهاراتكما. المفتاح هو أن تقبلي أن القيادة لا تعني السيطرة المطلقة، وأن القوة الحقيقية تكمن في المرونة والقدرة على التكيف. حافظي على استقلاليتك الشخصية ولا تتنازلي عن هويتك من أجل إرضاء الطرف الآخر. في النهاية، هذه العلاقة يمكن أن تكون رائعة إذا تعلمتما كيف توزّعان الأدوار بعدالة واحترام.",

  2: "استمتع بهدوء هذه العلاقة. ركز على بناء الثقة والتواصل الصادق. هذه العلاقة تحتاج إلى الرعاية والاهتمام المستمر.",

  3: "احتفل بهذا التوافق الرائع. ركز على بناء مستقبل مشترك. تجنب تدخل الآخرين في حياتكما الخاصة وخاصة الأم.",

  4: "هذه العلاقة تقوم على عاطفة جياشة وحماس شديد، حيث يلعب الرجل الدور الأقوى والأكثر تأثيراً. الجانب المشرق هو كثافة المشاعر والارتباط العميق بينكما، لكن الجانب المظلم هو الغيرة المفرطة التي قد تدمر كل شيء جميل بُني بينكما. الغيرة في هذا الترقيم ليست مجرد شعور عابر، بل هي نار مشتعلة يمكن أن تحرق العلاقة من جذورها إذا لم يتم التحكم فيها. الرغبة في امتلاك الشريك بالكامل هي أنانية مقنّعة بحب لا تعترف بحق الآخر في المساحة الشخصية والحرية. علاوة على ذلك، القيل والقال وتدخل الأشخاص الخارجيين يمثل خطراً حقيقياً على استقرار هذا الاتحاد. النصيحة الأساسية هنا هي أن تبني ثقة راسخة مع شريكك، لأن الثقة هي الترياق الوحيد المضاد للغيرة. أعطِ شريكك الحرية والاستقلالية التي يحتاجها، وتذكّر أن الحب الحقيقي لا يعني الامتلاك بل يعني الرغبة في رؤية الآخر سعيداً. تعاملي مع غيرة شريكك بهدوء وليس بالغضب، فكثيراً ما تنبع الغيرة من عدم الأمان الداخلي وليس من عدم الوفاء. اجعلي من التواصل المفتوح والصادق حجر الأساس في علاقتكما، وتحدثا عن مخاوفكما بشفافية بدلاً من تركها تكبر في الصمت.",

  5: "تعلم من هذه العلاقة. اقبل الاختلافات وركز على النقاط المشتركة. هذا الشخص سيساعدك على النمو والتطور.",

  6: "استمتع بهذا الانسجام الرائع. ركز على تعميق الحب والفهم المتبادل. هذه العلاقة ستستمر وتزدهر.",

  7: "هذه العلاقة تحمل طاقة التغيير المستمر والحركة الدائمة، فهي مليئة بالسفر والتنقل والتواصل مع عالم واسع. قد تبدو مثيرة ومغامرة في البداية، لكن التقلبات المستمرة قد تكون مرهقة جداً على المدى الطويل. أحد أكبر المخاطر في هذا الترقيم هو احتمال وجود الخداع أو عدم الصدق، حيث قد يكون أحد الطرفين غير ما يبدو عليه. هذه العلاقات غالباً ما تنتهي بسرعة لأن الأساس الذي بُنيت عليه قد لا يكون متيناً. النصيحة الأهم هنا هي أن تأخذي وقتك الكامل قبل اتخاذ أي قرار مصيري بشأن هذه العلاقة. لا تتسرعي في الارتباط أو التورط عاطفياً بشكل كامل قبل أن تتأكدي من حقيقة نوايا الطرف الآخر. هناك فرصة كبيرة للوقوع في الخطأ إذا استعجلتِ الأمور. راقبي الأفعال وليس الأقوال، لأن الأفعال هي التي تكشف النوايا الحقيقية. إذا لاحظتِ تناقضات بين ما يقوله شريكك وما يفعله، فاعتبري ذلك إشارة تحذيرية لا يجب تجاهلها. في المقابل، إذا كان شريكك صادقاً فعلاً، فإن هذه العلاقة قد تمنحك تجارب غنية ونمواً شخصياً كبيراً من خلال الانفتاح على عوالم جديدة. التوازن هو المفتاح: استمتعي بالمغامرة لكن لا تفقدي صلتك بالواقع.",

  8: "هذه العلاقة ليست علاقة حب بالمعنى التقليدي، بل هي ارتباط كرمي عميق يجمعكما معاً لأسباب تتجاوز الفهم العادي. في حياة سابقة، كان بينكما دين أو مظلمة أو إساءة تحتاجان إلى تصحيحها وإصلاحها في هذه الحياة. هذه العلاقات الكرمية صعبة جداً ومؤلمة، لكنها في الوقت نفسه يصعب كسرها أو الهروب منها لأنها تمثل فرصة للشفاء وتسوية الحسابات القديمة. الشعور بأنكما مقيدان معاً رغم كل الصعوبات ليس صدفة، بل هو القانون الكوني يعمل على إصلاح ما أُفسد في الماضي. النصيحة الجوهرية هنا هي أن تعملا على أنفسكما بدلاً من محاولة تغيير الشريك أو الهروب من العلاقة. هذا التحدي موجود في حياتكما لسبب، والهروب منه لن يحل المشكلة بل سيؤجلها فقط. ركزي على الشفاء الداخلي والنمو الروحي، وتعلمي الدروس التي تأتيك من هذه العلاقة. الصبر هنا ليس ضعفاً بل هو قوة، والفهم العميق لطبيعة العلاقة الكرمية سيخفف من معاناتك. ابحثي عن المعنى الأعمق وراء كل تحدٍ تواجهانه، وستجدين أن كل صعوبة هي في الحقيقة فرصة للتطور والارتقاء. عندما تتعلمين الدرس، ستتحررين من الكارما وستشعرين بسلام داخلي لم تعرفيه من قبل.",

  9: "هذه العلاقة من أكثر العلاقات تعقيداً وإيلاما، حيث يشعر كل طرف بأنه وحيد حتى وهو في وجود الآخر. الافتقار إلى المودة والاهتمام والدفء العاطفي يجعل هذا الاتحاد بارداً وموحشاً، وكأنكما تعيشان في عالمين متوازيين لا يتقاطعان أبداً. أخطر ما في هذا الترقيم هو احتمال أن يكون الحب في اتجاه واحد فقط: أنتِ تحبين ولا يُحَب، أو العكس. هذا الخلل في التوازن العاطفي يخلق ألماً نفسياً عميقاً يشبه الجرح الذي لا يلتئم. مع مرور الوقت، يبدأ هذا التحالف بالتفكك البطيء، وتتسع الفجوة بينكما حتى يصبح التواصل مستحيلاً. النصيحة هنا صعبة لكنها ضرورية: واجهي الحقيقة بشجاعة ولا تخدعي نفسك بأن الأمور ستتحسن بمفردها. إذا كنتِ الوحيدة التي تبذل الجهد في هذه العلاقة، فهذا ليس حباً بل هو تضحية من طرف واحد. ركزي على الاتصال العاطفي وحاولي فهم احتياجات شريكك بصدق، لكن لا تهملي احتياجاتك أنتِ أيضاً. قد تحتاجين إلى طلب المساعدة من متخصص في العلاقات الزوجية لمساعدتكما على فهم بعضكما البعض. إذا رفض شريكك المحاولة أو أظهر عدم اهتمام دائم، فاعلمي أن البقاء في علاقة أحادية الجانب سيدمر ثقتك بنفسك ويستنزف طاقتك. أحياناً يكون القرار الأشجاع هو الاستسلام لهذه الحقيقة والمضي قدماً نحو حياة أكثر توازناً.",

  10: "استمتع بهذا الحظ السعيد. ركز على تعميق الحب والفهم المتبادل. هذه العلاقة ستجلب السعادة والنجاح.",

  11: "هذه العلاقة تمثل صداماً بين شخصيتين قويتين جداً، كل منهما يسعى للهيمنة والسيطرة على الآخر. النزاعات والشقاق هما السمة الغالبة، وكثيراً ما يتدخل طرف ثالث يزيد من تعقيد المشهد ويخلق أزمات إضافية. احتمال الخيانة موجود بقوة في هذا الترقيم، سواء كانت خيانة عاطفية أو خيانة ثقة. التوتر الدائم والصراع على السلطة يجعلان من هذه العلاقة ساحة معركة مستمرة بدلاً من أن تكون ملاذاً آمناً. النصيحة الجوهرية هنا هي أن تتعلمي فن التنازل والتواصل الحقيقي. العلاقة لا يمكن أن تستمر إذا كان كل منكما يريد الفوز دائماً. عليكما أن تقدّما تنازلات حقيقية وليس تنازلات شكلية، وأن تبنيا جسوراً من التفاهم بدلاً من بناء جدران من العناد. من المهم جداً أن تحددا بوضوح حدود كل طرف في العلاقة وأن تحترما تلك الحدود بلا تجاوز. قد تحتاجان إلى مساعدة متخصص في العلاقات لمساعدتكما على تفكيك أنماط الصراع المتكررة وتعلم طرق صحية للتواصل. الجانب المفاجئ في هذا الترقيم هو أن التوافق الجسدي بينكما قد يكون قوياً جداً، وهذا قد يكون العنصر الذي يبقيكما معاً رغم كل الصعوبات. لكن تذكري أن التوافق الجسدي وحده لا يكفي لبناء علاقة مستدامة وسعيدة، فلا بد من عمل جاد على الجانب العاطفي والفكري أيضاً.",

  12: "هذه العلاقة تتطلب منك جهداً استثنائياً وتضحيات لا تنتهي، وكأنك في سباق ماراثون لا نهاية له. دائماً أنتِ الضحية، أنتِ من تتنازل، أنتِ من تتحمل وتصبر. هذه العلاقات الكرمية المعقدة تحمل مشاعر نادرة وعميقة لكنها مختلطة بالاستياء وسوء الفهم المزمن. كل ما تقدمينه يبدو أنه لا يُقدَّر ولا يُلاحظ، مما يخلق شعوراً دائماً بالظلم والإحباط. النصيحة الأساسية هنا هي أن تضعي حدوداً واضحة لما يمكنك تقديمه وما لا يمكنك تقديمه. الحب لا يعني أن تذوبي في الآخر وتفقدي نفسك. كوني صبورة لكن لا تكوني شهيدة، فالصبر مطلوب لكن التضحية الأبدية ليست حباً بل هي تدمير للذات. هذه العلاقة ستترك فيك أثراً عميقاً لا يُمحى، سواء استمرت أو انتهت، لذلك من المهم أن تتعلمي الدروس التي تأتيك منها. اسألي نفسك بصدق: هل هذا الجهد المبذول يُرجع لك شيئاً يجعلك سعيدة؟ أم أنك تعطين من فراغ لا يُملأ؟ لا تخجلي من طلب المساعدة من صديقة موثوقة أو متخصصة، لأن العلاقات التي تتطلب تضحية دائمة يمكن أن تدمر صحتك النفسية ببطء. تذكري أنك تستحقين علاقة متوازنة حيث يكون العطاء والخذ في كلا الاتجاهين.",

  13: "هذا الترقيم يحمل تحذيراً صريحاً وواضحاً: هذا الاتحاد سيء ومآله الانهيار عاجلاً أم آجلاً. عدم التوافق في الطاقة بينكما حقيقي وعميق، وليس مجرد اختلاف عابر يمكن حله بالحوار أو الصبر. العلاقة هنا ليست مجرد غير متوافقة، بل هي خطرة فعلاً وتحمل مخاطر جسيمة قد تشمل العنف اللفظي أو الجسدي في إطار الزواج. الطاقات السلبية المتضاربة تخلق بيئة سامة تجعل كلا الطرفين يعاني بشكل متواصل. النصيحة هنا حاسمة ومباشرة: كوني حذرة جداً ولا تتجاهلي العلامات التحذيرية مهما بدت صغيرة. أي سلوك عدواني أو مسيء يجب أن يُعتبر خطاً أحمر لا يمكن تجاوزه. أعيدي النظر في هذه العلاقة بجدية تامة واسألي نفسك: هل تستحقين أن تعيشي في خوف وقلق دائم؟ لا تترددي في طلب المساعدة والدعم من الأشخاص الموثوقين في حياتك، سواء كانوا أفراد عائلة أو أصدقاء مقربين أو متخصصين. لا تبقي في هذه العلاقة بدافع الخوف من الوحدة أو الضغط الاجتماعي، فهذا أمر يتعلق بسلامتك وسعادتك. إذا كنتِ متزوجة بالفعل، فابحثي عن استشارة قانونية ونفسية لمساعدتك على اتخاذ القرار الصحيح. تذكري دائماً أن حياتك وسلامتك أهم من أي ارتباط، وأن الاستمرار في علاقة خطرة لن يجعلها تتحسن بل سيزيد من خطورتها.",

  14: "استمتع بهذا الاستقرار والسلام. ركز على بناء حياة مشتركة سعيدة. هذه العلاقة ستستمر وتزدهر.",

  15: "هذا الترقيم يحمل إنذاراً خطيراً: هذه العلاقة مبنية على التلاعب والابتزاز العاطفي بصورة أو بأخرى. أحدكما يتحكم بالآخر بطرق خفية أو ظاهرة، مستخدماً المشاعر كأداة للضغط والسيطرة. الإدمان العاطفي أو الجسدي القوي بينكما ليس حباً حقيقياً بل هو ارتباط مرضي يشبه القيد الذي يصعب فكاكه. أسوأ ما في هذا الترقيم هو احتمال وجود تأثيرات سلبية خفية، كالسحر الأسود أو التلاعب النفسي المتعمد، الذي يمنعك من رؤية الحقيقة كما هي. قد تشعرين بأنك عالقة ولا تستطيعين المغادرة رغم أنك تعرفين في أعماقك أن هناك خطأً ما. النصيحة هنا عاجلة وحاسمة: استيقظي من هذه الأوهام وانظري للعلاقة بعين الحقيقة لا بعين المشاعر المخدرة. أي علاقة تقوم على التلاعب ليست حباً بل هي سجن عاطفي. اطلبي المساعدة الفورية من متخصص في الصحة النفسية أو من شخص تثقين به تماماً. لا تحاولي مواجهة هذا الوحدك، لأن التلاعب النفسي يعمل على إضعاف قدرتك على التفكير بوضوح. أحاطي نفسك بأشخاص يريدون لك الخير حقاً ويستطيعون رؤية ما لا تستطيعين رؤيته. تذكري أن الحب الحقيقي يحررك ولا يقيدك، ويرفعك ولا يخفضك، ويمنحك القوة ولا يسلبك إياها. الخروج من علاقة تلاعبية يتطلب شجاعة، لكنه الخطوة الأولى نحو استعادة حياتك وكرامتك.",

  16: "هذا الترقيم من أخطر الترقيمات على الإطلاق، ويحمل رسالة واضحة: حاولي بأي ثمن ألا تربطي حياتك بهذا الشخص. العلاقة هنا غير مستقرة بشكل متطرف، مليئة بالشتائم والصراخ والمشاجرات التي لا تنتهي. البيئة السائلة من التوتر والعداء تجعل الحياة اليومية جحيماً لا يطاق. النتيجة الحتمية لهذا النوع من العلاقات هي الطلاق أو الانفصال المؤلم، لأن الاثنين غير مناسبين لبعضهما على كل المستويات. نسبة المخاطر عالية جداً لكلا الشريكين، سواء على المستوى النفسي أو العاطفي أو حتى الجسدي. النصيحة هنا قاطعة: أعيدي النظر في هذه العلاقة بجدية تامة ولا تأخذي الأمور بشكل هين. كل يوم تمضينه في هذه العلاقة السامة هو يوم يُسرق من حياتك وسعادتك. لا تخدعي نفسك بأنك تستطيعين تغيير هذا الشخص أو أن الأمور ستتحسن بعد الزواج أو بعد إنجاب الأطفال، فالواقع عكس ذلك تماماً. إذا كنتِ لا تزالين في مرحلة التعارف، فالحل الأمثل هو الانسحاب فوراً قبل أن يزداد التعلق ويصبح الفراق أصعب. وإذا كنتِ متزوجة بالفعل، فابحثي عن دعم قانوني ونفسي لمساعدتك على الخروج بأمان. لا تبقي خوفاً من حكم الناس أو الخوف من المستقبل، فالمستقبل في علاقة كهذه أسوأ بكثير من المستقبل وحيدة. احمي نفسك وكرامتك ولا تقبلي بأقل مما تستحقين.",

  17: "استمتع بهذا الاتحاد المثالي. أنتما تكملان بعضكما البعض بشكل جيد. ركزي على بناء مستقبل عظيم مع شريكك.",

  18: "هذا الترقيم يكشف عن علاقة مبنية على الوهم والأفكار الخاطئة أكثر مما هي مبنية على الحقيقة والواقع. المشكلات في هذا الاتحاد ناتجة عن عدم رؤية الأمور بوضوح، إما بسبب خداع متعمد من أحد الطرفين أو بسبب أوهام تسكن عقل الضحية وتمنعها من رؤية الحقيقة. الخيانة هنا ليست مجرد احتمال بل هي نمط متكرر، والخطر الحقيقي يكمن في اختيار شخص كهذا أساساً. أخطر ما في هذا الترقيم هو الاعتقاد بأنه يمكن إصلاح العلاقة بوسائل غير طبيعية مثل السحر أو الأعمال الروحية، وهذا وهم خطير يزيد الطين بلة ويجعلك تدورين في حلقة مفرغة من الأمل الكاذب والخيبة المتكررة. النصيحة الجوهرية هنا هي أن تتوقفي عن خداع نفسك وأن تنظري للعلاقة كما هي فعلاً وليس كما تتمنين أن تكون. أعيدي النظر في اختيارك بصدق وموضوعية، واسألي نفسك: هل هذا الشخص يُظهر لك الاحترام والصدق؟ أم أنكِ تتمسكين بصورة خيالية عنه لا علاقة لها بالواقع؟ لا تضعي أملاً في السحر أو الحلول السحرية، فالحل الوحيد هو مواجهة الحقيقة واتخاذ قرار شجاع. إذا كانت العلاقة تؤذيك بشكل متكرر، فالرحيل هو الحل الأكثر حكمة وشجاعة. لا تستثمري المزيد من الوقت والمشاعر في وهم، بل اتجهي نحو واقع أفضل يمنحك السلام والاحترام الذي تستحقينه.",

  19: "احتفل بهذا التوافق الدافئ. ركز على بناء أسعة سعيدة مع أطفال أصحاء. هذه العلاقة مليئة بالحب الحقيقي والدعم.",

  20: "هذه العلاقة تبدأ بمشاكل وتعقيدات قد تجعلك تشعرين بالإحباط والرغبة في الاستسلام. في البداية، يبدو التآلف بينكما مستحيلاً وكأنكما تتحدثان لغتين مختلفتين. كل محاولة للتقارب تنتهي بسوء فهم أو خيبة أمل، وهذا قد يدفعك للاعتقاد بأن العلاقة محكوم عليها بالفشل. لكن المفاجأة هنا هي أن هذه المشاكل الأولية مؤقتة جداً وتختفي بسرعة أكبر مما تتوقعين. مع مرور الوقت، يبدأ كل منكما بالتأقلم مع طبيعة الآخر وتعلم لغته العاطفية الخاصة. العلاقة تتحول تدريجياً من صراع إلى انسجام، ومن توتر إلى هدوء. النصيحة الأساسية هنا هي أن تعطي العلاقة الوقت الكافي لتنضج ولا تستعجلي النتائج. كل علاقة تحتاج إلى فترة تأسيس يتعلم فيها الطرفان كيف يتعاملان مع بعضهما البعض. هذه العلاقة في جوهرها صداقة مخلصة وعلاقة جيدة تستحق الصبر. المشاعر بينكما ستكون قوية وعميقة بمجرد أن تتجاوزي حاجز البدايات الصعبة. المفتاح هو التواصل المستمر والصادق وعدم التراجع عند أول عقبة. تذكري أن أجمل المباني تحتاج إلى وقت لبنائها، وأن الصبر في البداية سيُثمر بانسجام واستقرار في المستقبل.",

  21: "احتفل بهذا السلام والانسجام. زواج قوي وجدي. ركز على رعاية بعضكم البعض والحفاظ على توافق الطاقة.",

  22: "هذا الترقيم يحمل طاقة بركانية هائلة تهدد بالانفجار في أي لحظة دون سابق إنذار. العطش الشديد للحرية والاستقلالية يجعل هذه العلاقة غير متوقعة على الإطلاق، فاليوم هادئ وغداً عاصفة. شريكك في هذا الترقيم شخص غير عادي بكل ما تحمله الكلمة، يمتلك طاقة متفجرة وروحاً متمردة لا تقبل بالقيود. هذا يجعل الحياة معه مثيرة لكنها مرهقة للغاية، فأنتِ تعيشين على حافة البركان لا تعرفين متى يثور. التراكمات العاطفية والنفسية تتصاعد ببطء حتى تصل إلى نقطة الانهيار، وعندئذ يكون الانفجار مدمراً. النصيحة هنا واقعية وصريحة: العمل الجاد والمستمر مطلوب لجعل هذه العلاقة هادئة ومستقرة، لكن هذا العمل مرهق جداً وقد لا ينتهي أبداً. يجب أن تكوني صادقة مع نفسك وتسألي: هل أنتِ مستعدة للعيش في حالة ترقب دائم؟ هل تطيقين عدم الاستقرار كأسلوب حياة؟ الواقع أن المصير الأرجح لهذه العلاقة هو الطلاق أو الانفصال، لأن القليلون يستطيعون تحمل هذا المستوى من عدم اليقين بشكل مستمر. إذا قررتِ البقاء، فعليكما معاً العمل على قنوات التعبير الصحي عن المشاعر بدلاً من كبتها حتى الانفجار. التواصل اليومي والصادق هو خط الدفاع الأول. لكن لا تلومي نفسك إذا لم تستطيعي التحمل، فليس كل شخص يتناسب مع هذه الطاقة البركانية، والانسحاب في الوقت المناسب قد يكون قراراً حكيماً يحميك ويحمي شريكك من ألم أكبر."
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

    // Initialize Spaceremit SDK after it loads
    const initSpaceremit = () => {
      if (typeof (window as any).SpaceremitPay === 'function') {
        try {
          ;(window as any).SpaceremitPay()
          console.log('Spaceremit SDK initialized successfully')
        } catch (e) {
          console.log('Spaceremit init error:', e)
        }
      } else {
        // Retry until SDK is loaded
        setTimeout(initSpaceremit, 1000)
      }
    }
    setTimeout(initSpaceremit, 2000)
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
    // Retry multiple times to ensure SDK is loaded
    const tryInit = (attempt: number) => {
      if (attempt > 10) {
        console.error('Spaceremit SDK failed to load after 10 attempts')
        return
      }
      if (typeof window !== 'undefined' && typeof (window as any).SpaceremitPay === 'function') {
        try {
          console.log('Initializing Spaceremit SDK, attempt:', attempt)
          ;(window as any).SpaceremitPay()
        } catch (e) {
          console.log('Spaceremit init error:', e)
        }
      } else {
        console.log('Spaceremit SDK not loaded yet, retrying in 500ms...', attempt)
        setTimeout(() => tryInit(attempt + 1), 500)
      }
    }
    setTimeout(() => tryInit(1), 300)
  }, [])

  const category = getCategory(resultNumber)
  const badgeText = getBadgeText(category)

  return (
    <>
      {/* Spaceremit Configuration Script - Using var so variables are on window object */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var SP_PUBLIC_KEY = "${SP_PUBLIC_KEY}";
            var SP_FORM_ID = "${SP_FORM_ID}";
            var SP_SELECT_RADIO_NAME = "${SP_SELECT_RADIO_NAME}";
            var LOCAL_METHODS_BOX_STATUS = ${LOCAL_METHODS_BOX_STATUS};
            var LOCAL_METHODS_PARENT_ID = "${LOCAL_METHODS_PARENT_ID}";
            var CARD_BOX_STATUS = ${CARD_BOX_STATUS};
            var CARD_BOX_PARENT_ID = "${CARD_BOX_PARENT_ID}";
            var SP_FORM_AUTO_SUBMIT_WHEN_GET_CODE = ${SP_FORM_AUTO_SUBMIT_WHEN_GET_CODE};
            console.log('Spaceremit config loaded. SP_PUBLIC_KEY:', SP_PUBLIC_KEY);
            console.log('window.SP_PUBLIC_KEY:', window.SP_PUBLIC_KEY);
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
              Following Spaceremit official documentation structure
              ============================================ */}
          <form id="spaceremit-form" style={{ width: '100%' }}>
            {/* Spaceremit: Price & Currency (hidden fields) */}
            <input type="hidden" name="amount" value={SP_AMOUNT} />
            <input type="hidden" name="currency" value={SP_CURRENCY} />

            {/* Spaceremit: Local Payment Methods Section */}
            <div className="sp-one-type-select">
              <input
                type="radio"
                name="sp-pay-type-radio"
                value="local-methods-pay"
                id="sp_local_methods_radio"
                defaultChecked
                style={{ display: 'none' }}
              />
              <label htmlFor="sp_local_methods_radio">
                <div style={{ color: 'var(--neon-cyan)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  {currentLang === 'ar' ? '💳 طرق الدفع المحلية' : '💳 Local Payment Methods'}
                </div>
              </label>
              <div id="spaceremit-local-methods-pay"></div>
            </div>

            {/* Spaceremit: Card Payment Section */}
            <div className="sp-one-type-select">
              <input
                type="radio"
                name="sp-pay-type-radio"
                value="card-pay"
                id="sp_card_radio"
                style={{ display: 'none' }}
              />
              <label htmlFor="sp_card_radio">
                <div style={{ color: 'var(--amber)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  {currentLang === 'ar' ? '💳 بطاقة ائتمان' : '💳 Card Payment'}
                </div>
              </label>
              <div id="spaceremit-card-pay"></div>
            </div>

            {/* Spaceremit: Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.8rem',
                marginTop: '1rem',
                background: 'linear-gradient(135deg, var(--amber), #c77d00)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'Cairo, sans-serif'
              }}
            >
              {currentLang === 'ar' ? 'ادفع الآن' : 'Pay Now'} 💰
            </button>
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
