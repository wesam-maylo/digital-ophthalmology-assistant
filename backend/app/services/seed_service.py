import json

from sqlalchemy.orm import Session

from app.models.library_item import LibraryItem
from app.models.section import Section


def seed_content(db: Session) -> None:
    if db.query(Section).count() == 0:
        about_payload = {
            "subtitle": "FACULTY OF ARTIFICIAL INTELLIGENCE",
            "description": "Work-Based Professional Project in Computer Science",
            "project_title": "AI-Based Classification of Anterior Eye Diseases Using Deep Learning",
            "supervisor": "Dr. Eman Salah",
            "team_members": [
                "Fares Tamer Abdel Majeed - 4241097",
                "Israa Eldsouky Ibrahim - 4241107",
                "Mohamed Ayman Dorgham - 4241041",
                "Mohamed Mahmoud Wahba - 4241543",
                "Karim Saeed Ahmed - 4241153",
                "Rawan Elsaid Elrasef - 4241331",
                "Ohoud Abdelnaem Abdallah - 4241386",
                "Sama Abdeltawab Elshaikh - 4241400",
                "Waad Ahmed Gaffer - 4241415",
                "Wesam Mohamed Maylo - 42411018",
                "Zeyad Waleed Mohamed - 4232012",
            ],
            "stack": ["MobileNetV2", "Flask", "HTML/CSS/JS"],
            "datasets": [
                "Infectious Keratitis Dataset Based on Multimodal Slit-Lamp Images",
                "SUSTech-SYSU dataset for corneal ulcers",
                "Cataract Dataset",
                "SLID - Slit-Lamp Anterior Segment Dataset",
                "EyeHealer - Large-Scale Anterior Eye Segment Dataset",
            ],
        }

        safety_payload = {
            "intro": "This platform is for educational simulation and interface demonstration only.",
            "cards": [
                {
                    "title": "Educational Purpose",
                    "content": "The diagnostic output is simulated and intended to teach triage logic and interpretation flow.",
                },
                {
                    "title": "Not a Medical Diagnosis",
                    "content": "Results must not replace physician examination, slit-lamp evaluation, or emergency care pathways.",
                },
                {
                    "title": "Data Handling in This Demo",
                    "content": "All interactions run via the backend API in development mode.",
                },
                {
                    "title": "Model Limitations",
                    "content": "Algorithmic systems can produce false positives/negatives due to image quality, bias, and domain shift.",
                },
            ],
            "escalation_advice": "If severe pain, sudden vision loss, intense photophobia, trauma, or corneal opacity is present, seek urgent ophthalmology care immediately.",
        }

        education_payload = {
            "intro": "Practical guidance for image quality, urgency recognition, and protective habits.",
            "blocks": [
                {
                    "title": "How to Capture a Good Image",
                    "items": [
                        "Use bright, even lighting without heavy shadows.",
                        "Keep the camera aligned with the eye and avoid tilt.",
                        "Hold focus for a clear corneal and conjunctival view.",
                    ],
                    "arabic_title": "إرشادات تصوير واضحة",
                    "arabic_text": "تأكد من إضاءة جيدة، وثبات الكاميرا، وعدم وجود اهتزاز أثناء التصوير للحصول على صورة أدق.",
                },
                {
                    "title": "Urgent vs Non-Urgent",
                    "items": [
                        "Seek urgent care if severe pain, sudden vision loss, or marked light sensitivity occurs.",
                    ],
                    "arabic_title": "علامات تستدعي التدخل العاجل",
                    "arabic_text": "ألم شديد ومفاجئ، ضعف مفاجئ في الرؤية، أو بقعة واضحة على القرنية.",
                },
                {
                    "title": "Hygiene & Prevention Basics",
                    "items": [
                        "Wash hands before touching eyes or contact lenses.",
                        "Do not share towels, eye drops, or makeup.",
                        "Use protective eyewear in dusty and sunny environments.",
                    ],
                    "arabic_title": "نصائح وقائية عامة",
                    "arabic_text": "حافظ على النظافة الشخصية للعين وتجنب الاستخدام الخاطئ للعدسات اللاصقة.",
                },
            ],
        }

        db.add_all(
            [
                Section(section_type="about", title="DELTA UNIVERSITY FOR SCIENCE AND TECHNOLOGY", content=json.dumps(about_payload)),
                Section(section_type="safety", title="Safety & Disclaimer", content=json.dumps(safety_payload)),
                Section(section_type="education", title="Patient Education Center", content=json.dumps(education_payload)),
            ]
        )

    if db.query(LibraryItem).count() == 0:
        rows = [
            {
                "id": "normal",
                "name": "Normal",
                "name_ar": "طبيعي",
                "short": "Healthy anterior eye appearance with no obvious inflammatory or degenerative signs.",
                "short_ar": "مظهر طبيعي للجزء الأمامي من العين دون علامات واضحة لالتهاب أو تغيرات مرضية.",
                "symptoms_ar": ["لا يوجد ألم", "لا يوجد احمرار ملحوظ", "رؤية مستقرة وواضحة"],
                "red_flags_ar": ["انخفاض مفاجئ في الرؤية", "ألم شديد بالعين", "إصابة مباشرة أو صدمة للعين"],
                "safe_tips_ar": ["استخدم نظارات واقية من الأشعة فوق البنفسجية", "تجنب فرك العين باليد", "حافظ على الفحص الدوري للعين"],
                "when_to_see_doctor_ar": "راجع طبيب العيون فوراً عند ظهور ألم شديد أو احمرار مستمر أو تدهور مفاجئ في الرؤية.",
                "risk_level": "Low",
            },
            {
                "id": "conjunctivitis",
                "name": "Conjunctivitis",
                "name_ar": "التهاب الملتحمة",
                "short": "Inflammation of the conjunctiva that may be viral, bacterial, or allergic.",
                "short_ar": "التهاب في ملتحمة العين وقد يكون فيروسياً أو بكتيرياً أو تحسسياً.",
                "symptoms_ar": ["احمرار العين", "حكة أو إحساس بالحرقان", "إفرازات أو التصاق الجفون"],
                "red_flags_ar": ["حساسية شديدة للضوء", "تشوش ملحوظ في الرؤية", "ألم شديد أو متزايد"],
                "safe_tips_ar": ["اغسل يديك باستمرار", "لا تشارك المناشف أو أدوات العين", "تجنب العدسات اللاصقة أثناء الالتهاب"],
                "when_to_see_doctor_ar": "يجب زيارة الطبيب إذا استمرت الأعراض لأكثر من يومين أو صاحبها ألم شديد أو ضعف في الرؤية.",
                "risk_level": "Moderate",
            },
            {
                "id": "pterygium",
                "name": "Pterygium",
                "name_ar": "الظفرة",
                "short": "Fibrovascular growth from conjunctiva toward cornea, often linked to UV exposure.",
                "short_ar": "نمو لحمي من الملتحمة باتجاه القرنية ويرتبط غالباً بالتعرض المزمن للشمس والأتربة.",
                "symptoms_ar": ["إحساس بجسم غريب داخل العين", "جفاف وتهيج متكرر", "ظهور نسيج ممتد ناحية القرنية"],
                "red_flags_ar": ["زيادة سريعة في حجم الظفرة", "تأثر الرؤية أو حدوث لا بؤرية", "التهاب واحمرار مستمران"],
                "safe_tips_ar": ["ارتدِ نظارات شمسية واقية", "استخدم قطرات مرطبة عند الحاجة", "قلل التعرض للغبار والرياح"],
                "when_to_see_doctor_ar": "استشر طبيب العيون عند امتداد الظفرة نحو مركز القرنية أو عند تأثر الرؤية والراحة اليومية.",
                "risk_level": "Moderate",
            },
            {
                "id": "keratitis",
                "name": "Keratitis",
                "name_ar": "التهاب القرنية",
                "short": "Corneal inflammation/infection that may threaten vision if untreated.",
                "short_ar": "التهاب أو عدوى بالقرنية وقد يهدد الرؤية إذا لم يتم علاجه بسرعة.",
                "symptoms_ar": ["ألم شديد بالعين", "احمرار واضح ودموع", "حساسية شديدة للضوء"],
                "red_flags_ar": ["بقعة أو عتامة على القرنية", "انخفاض ملحوظ في حدة الرؤية", "تاريخ استخدام خاطئ أو مفرط للعدسات"],
                "safe_tips_ar": ["اطلب تقييماً طبياً عاجلاً", "أوقف العدسات اللاصقة فوراً", "تجنب استخدام قطرات بدون وصفة"],
                "when_to_see_doctor_ar": "التهاب القرنية قد يكون حالة طارئة. توجّه للطبيب أو الطوارئ فوراً عند الألم الشديد أو ضعف الرؤية.",
                "risk_level": "High",
            },
        ]

        db.add_all(
            [
                LibraryItem(
                    disease_id=item["id"],
                    name=item["name"],
                    name_ar=item["name_ar"],
                    short=item["short"],
                    short_ar=item["short_ar"],
                    symptoms_ar=json.dumps(item["symptoms_ar"]),
                    red_flags_ar=json.dumps(item["red_flags_ar"]),
                    safe_tips_ar=json.dumps(item["safe_tips_ar"]),
                    when_to_see_doctor_ar=item["when_to_see_doctor_ar"],
                    risk_level=item["risk_level"],
                )
                for item in rows
            ]
        )

    db.commit()
