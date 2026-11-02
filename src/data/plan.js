// Single source of truth: "Hooreya 1600kcal" PDF.
// Every `text` string below is transcribed from the PDF as printed (page 1 table, page 2 list).
// Wording, numbers, fractions, punctuation and spelling are kept as in the original —
// including items flagged in `clarifications` — and are never edited by the app.

export const PLAN_TITLE = 'Hooreya 1600 kcal';

export const meals = [
  {
    id: 'breakfast',
    header: 'الفطور (8 صباحاً)',
    titleAr: 'الفطور',
    titleEn: 'Breakfast',
    time: '08:00',
    timeLabelAr: '8 صباحاً',
    timeLabelEn: '8:00 AM',
    icon: 'sunrise',
    options: [
      'اومليت: ٢ بيض + ٢ خبز سلايس بر + ٢/١ كوب خضار مطبوخة مع البيض (سبانخ، طماطم، فلفل رومي..) + ٢/١ كوب حليب قليل الدسم',
      '٥٥ غرام جبنة بيضة قليلة الدسم (حلوم/فيتا/قريش) + ١ خبز لبناني صغير أو ٢ خبز سلايس بر + كوب خضار حسب الرغبة + ½ كوب حليب',
      'حبة بيض مسلوقة + ملعقتين لبنة + ١ خبز لبناني صغير بر + ٢/١ كوب خضار مطبوخة + ٢/١ كوب حليب قليل الدسم',
      'كوب أي نوع فاصوليا + كوب سلطة أو ٢/١ كوب خضار مطبوخة + ٢/١ كوب حليب قليل الدسم',
    ],
  },
  {
    id: 'snack-am',
    header: 'وجبة خفيفة (11 صباحاً)',
    titleAr: 'وجبة خفيفة',
    titleEn: 'Morning snack',
    time: '11:00',
    timeLabelAr: '11 صباحاً',
    timeLabelEn: '11:00 AM',
    icon: 'apple',
    options: [
      'فاكهة متوسطة الحجم (تفاح، برتقال، كمثرى، جوافة..) + ٦ حبات مكسرات مشكلة (غير مملحة)',
      'كوب من (الفراولة والتوت بأنواعه) + ٦ حبات مكسرات مشكلة',
      '٣ حبات تمر صغيرة + ٢ ملعقة صغيرة طحينة أو ٦ حبات لوز',
    ],
  },
  {
    id: 'lunch',
    header: 'الغداء (2 مساءً)',
    titleAr: 'الغداء',
    titleEn: 'Lunch',
    time: '14:00',
    timeLabelAr: '2 مساءً',
    timeLabelEn: '2:00 PM',
    icon: 'plate',
    options: [
      '90 غرام دجاج أو لحم (قليل أو منزوع الدسم) + كوب رز + ملعقة زيت (للطبخ) + كوب ونص سلطة أو كوب خضار مطبوخة',
      '90 غرام سمك مشوي بدون جلد (نوع السمك حسب الرغبة) + كوب ونص بطاطس مهروسة أو كوب رز + كوب ونص سلطة أو كوب خضار مطبوخة',
      '90 غرام دجاج مشوي أو لحم مفروم منزوع الدسم + كوب معكرونة بصلصة الطماطم + كوب ونص سلطة أو كوب خضار مطبوخة',
    ],
  },
  {
    id: 'snack-pm',
    header: 'وجبة خفيفة (5 مساءً)',
    titleAr: 'وجبة خفيفة',
    titleEn: 'Afternoon snack',
    time: '17:00',
    timeLabelAr: '5 مساءً',
    timeLabelEn: '5:00 PM',
    icon: 'cup',
    options: [
      '4/3 كوب زبادي قليل الدسم + حبة فاكهة متوسطة الحجم',
      '١٨٠ مل لبن قليل الدسم + حبة فاكهة متوسطة الحجم أو ٣ حبات تمر صغيرة',
      '٣ اكواب من الفشار',
    ],
  },
  {
    id: 'dinner',
    header: 'العشاء (8 مساءً)',
    titleAr: 'العشاء',
    titleEn: 'Dinner',
    time: '20:00',
    timeLabelAr: '8 مساءً',
    timeLabelEn: '8:00 PM',
    icon: 'moon',
    options: [
      'حبة بيض مسلوقة + ٣ ملاعق لوبيا + ٢/١ خبز لبناني صغير الحجم + ملعقة لبنة + كوب ونص سلطة أو كوب خضار مطبوخة',
      'سندويش: 90 غرام دجاج مشوي أو تونة (بالماء) + شريحتين خبز بر + ملعقة مايونيز لايت + كوب ونص خضار مقطعة أو كوب خضار مطبوخة',
      '80 غرام شيش طاووق + ١ خبز لبناني صغير الحجم + ملعقتين حمص + كوب ونص سلطة أو كوب خضار مطبوخة',
    ],
  },
];

export const optionLabelsAr = ['الخيار الأول', 'الخيار الثاني', 'الخيار الثالث', 'الخيار الرابع'];
export const optionLabelsEn = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];

export const instructionsHeader = 'تعليمات عامة:';

export const instructions = [
  'تناول منتجات الالبان قليلة الدسم فقط.',
  'تناول كوبين فقط في اليوم من منتجات الالبان (روب، لبن، حليب)',
  'تناول الدهون النباتية الصحية مثل زيت الزيتون البكر.',
  'الابتعاد عن الدهون الحيوانية المشبعة مثل الزبدة /السمنة والأطعمة المقلية والوجبات السريعة.',
  'النوم لمدة كافية لا تقل عن السبع ساعات.',
  'تناول الخضار اولاً قبل تناول الطبق الرئيسي.',
  'تناول اللحوم الحمراء مرة واحدة في الأسبوع فقط.',
  'الابتعاد عن الأطعمة التي تحتوي على كمية عالية من السكر مثل المخبوزات، الحلويات، المشروبات الغازية.',
  'ممارسة الرياضة ٤ -٦ أيام في الأسبوع لمدة لا تقل عن ٤٥ دقيقة.',
];

// Points in the PDF that are ambiguous. The app shows them as-is and lists them here
// for the dietitian to confirm — it does not reinterpret the plan.
export const clarifications = [
  {
    where: { ar: 'عدة وجبات', en: 'Several meals' },
    text: '٢/١ كوب',
    ar: 'الكسر مكتوب في المستند "٢/١" بينما كُتب "½" في الفطور (الخيار الثاني). يُرجَّح أن المقصود نصف كوب، لكن يُنصح بالتأكد من أخصائية التغذية.',
    en: 'The PDF writes the fraction as "٢/١" (shown as 2/1). Breakfast option 2 writes "½" instead. Both very likely mean ½ cup — please confirm with the dietitian.',
  },
  {
    where: { ar: 'وجبة خفيفة (5 مساءً) — الخيار الأول', en: 'Afternoon snack — option 1' },
    text: '4/3 كوب زبادي',
    ar: 'مكتوب "4/3 كوب". قد يكون المقصود ¾ كوب (إذا قُرئ الكسر من اليمين لليسار كما في "٢/١")، أو ١⅓ كوب. يُرجى التأكد.',
    en: 'Written as "4/3 cup". It may mean ¾ cup (read right-to-left, like "٢/١") or 1⅓ cups. Please confirm.',
  },
  {
    where: { ar: 'الفطور — الخيار الثاني', en: 'Breakfast — option 2' },
    text: '½ كوب حليب',
    ar: 'لم يُذكر "قليل الدسم" في هذا الخيار، لكن التعليمة رقم ١ تنص على منتجات ألبان قليلة الدسم فقط.',
    en: 'This option says "½ كوب حليب" (½ cup milk) without "low-fat", while general instruction 1 says dairy should be low-fat only.',
  },
  {
    where: { ar: 'السعرات', en: 'Calories' },
    text: '1600 kcal',
    ar: 'رقم ١٦٠٠ سعرة مأخوذ من اسم الملف فقط، ولا يحتوي المستند على حساب للسعرات. لم يتم التحقق منه.',
    en: 'The 1600 kcal figure comes only from the document name; the PDF contains no calorie breakdown and it has not been verified.',
  },
];
