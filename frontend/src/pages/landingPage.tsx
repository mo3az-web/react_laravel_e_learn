import React from "react";
import { 
  BookOpen, 
  CheckCircle2, 
  GraduationCap, 
  Users, 
  Video, 
  Layout, 
  ArrowRight, 
  ShieldCheck, 
  Star,
  Clock
} from "lucide-react";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-all font-sans">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[95vh] flex flex-col md:flex-row items-center justify-between bg-emerald-900 px-6 md:px-20 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>
        </div>

        {/* LEFT SIDE: Image with overlapping elements */}
        <div className="relative w-full md:w-1/2 flex justify-center items-center py-12 md:py-0 order-2 md:order-1">
          <div className="relative z-10 group">
            <div className="absolute -inset-4 bg-white/5 backdrop-blur-sm rounded-[2rem] border border-white/10 group-hover:bg-white/10 transition-all duration-500"></div>
            <div className="relative overflow-hidden rounded-[1.8rem] border-2 border-white/20 shadow-2xl">
              <img
                src="/teach.png"
                alt="Teacher"
                className="w-[320px] md:w-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-emerald-600 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
              <div className="bg-emerald-100 dark:bg-emerald-500/30 p-2 rounded-lg text-emerald-600 dark:text-white">
                <ShieldCheck size={24} />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500 dark:text-emerald-100 uppercase tracking-wider">محتوى</p>
                <p className="text-sm font-bold dark:text-white text-emerald-900">موثوق ومعتمد</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Text Content */}
        <div className="w-full md:w-1/2 text-right text-white space-y-8 z-20 order-1 md:order-2" dir="rtl">
          <div className="inline-flex items-center gap-2 bg-emerald-800/50 backdrop-blur-md border border-emerald-700/50 px-4 py-2 rounded-full text-emerald-200 text-sm mb-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            اكاديمية العلوم الشرعية الحديثة
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.15]">
            رحلتك في <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-200 to-emerald-400">
              طلب العلم الشرعي
            </span>
          </h1>

          <p className="text-emerald-100/80 text-lg md:text-xl max-w-xl ml-auto leading-relaxed">
            منصة تعليمية متكاملة تهدف إلى تبسيط العلوم الفقهية والتربوية بأسلوب عصري يجمع بين الأصالة والسهولة.
          </p>

          <div className="flex flex-row-reverse gap-4 pt-4">
            <button className="group relative flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.4)] overflow-hidden">
              <span>ابدأ التعلم الآن</span>
              <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-semibold transition-all">
              تصفح المسارات
            </button>
          </div>

          <div className="flex justify-end gap-10 pt-10">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                <span className="text-emerald-400">+</span>500
              </div>
              <p className="text-xs text-emerald-200/60 mt-1 uppercase tracking-widest font-medium">درس مسجل</p>
            </div>
            <div className="w-[1px] h-12 bg-white/10"></div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                <span className="text-emerald-400">+</span>50k
              </div>
              <p className="text-xs text-emerald-200/60 mt-1 uppercase tracking-widest font-medium">طالب مستفيد</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY JOIN ME SECTION */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-16">
            
            {/* Text Side */}
            <div className="w-full md:w-1/2 text-right" dir="rtl">
              <h2 className="text-4xl font-bold mb-6">لماذا تشترك في هذه المنصة؟</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-10">
                لقد صممت هذا المنهج ليكون جسراً يربط الطالب بجمال العلوم الإسلامية بعيداً عن التعقيد الأكاديمي الصعب، مع التركيز على التطبيق العملي في حياتك اليومية.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "متابعة شخصية", desc: "إمكانية التواصل المباشر لطرح الأسئلة والاستفسارات.", icon: <Users className="text-emerald-600" /> },
                  { title: "محتوى حصري", desc: "دروس وملخصات PDF غير متوفرة في أي مكان آخر.", icon: <Star className="text-emerald-600" /> },
                  { title: "مرونة كاملة", desc: "شاهد الدروس في أي وقت ومن أي جهاز يناسبك.", icon: <Clock className="text-emerald-600" /> },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="flex-1">
                      <h4 className="font-bold text-xl group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                      <p className="text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                      {item.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Side (Stats Grid) */}
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white text-right">
                  <Video size={40} className="mb-4 opacity-50" />
                  <h3 className="text-2xl font-bold">بث مباشر</h3>
                  <p className="text-emerald-100 text-sm mt-2">لقاءات أسبوعية تفاعلية للإجابة على التساؤلات.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 text-right">
                  <Layout size={40} className="mb-4 text-emerald-600" />
                  <h3 className="text-2xl font-bold">واجهة سهلة</h3>
                  <p className="text-gray-500 text-sm mt-2">تجربة مستخدم بسيطة تركز على المحتوى التعليمي.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 text-right">
                  <GraduationCap size={40} className="mb-4 text-emerald-600" />
                  <h3 className="text-2xl font-bold">شهادة إتمام</h3>
                  <p className="text-gray-500 text-sm mt-2">احصل على شهادة بعد اجتياز الاختبارات النهائية.</p>
                </div>
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-8 rounded-[2.5rem] text-right">
                  <CheckCircle2 size={40} className="mb-4 text-emerald-600" />
                  <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">اختبارات</h3>
                  <p className="text-emerald-800/60 dark:text-emerald-300/60 text-sm mt-2">تقييمات مستمرة لقياس مدى استيعابك للمادة.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COURSES PREVIEW */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-right" dir="rtl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black mb-4">أبرز المسارات التعليمية</h2>
            <p className="text-gray-500 text-lg">مناهج مكثفة تم إعدادها بعناية لتناسب المبتدئين والمتقدمين في طلب العلم.</p>
          </div>
          <button className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-4 transition-all group">
            عرض كل الكورسات <ArrowRight size={20} className="rotate-180" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "فقه العبادات", category: "الفقه", icon: <BookOpen />, students: "12,400" },
            { title: "سلسلة الأخلاق", category: "التربية", icon: <GraduationCap />, students: "8,200" },
            { title: "سيرة المصطفى", category: "التاريخ", icon: <Star />, students: "15,100" },
          ].map((course, i) => (
            <div key={i} className="group relative bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all duration-300 shadow-sm hover:shadow-2xl">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                {course.icon}
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">{course.category}</span>
              <h3 className="text-2xl font-bold mt-4 mb-3">{course.title}</h3>
              <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
                <span className="flex items-center gap-1"><Users size={14} /> {course.students} طالب</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>24 درس</span>
              </div>
              <button className="w-full py-4 rounded-xl border border-gray-100 dark:border-gray-800 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all font-bold">
                ابدأ المسار الآن
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">ابدأ رحلتك في طلب العلم اليوم</h2>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10 opacity-90">
            انضم إلى أكثر من 50 ألف طالب وطالبة يتعلمون دينهم بوضوح ومنهجية صحيحة.
          </p>
          <button className="bg-white text-emerald-600 px-12 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-all shadow-xl relative z-10">
            تسجيل حساب جديد
          </button>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;