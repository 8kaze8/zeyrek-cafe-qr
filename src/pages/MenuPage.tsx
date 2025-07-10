import { useState, useEffect, useRef } from "react";
import { CategoryList } from "../components/CategoryList";
import { ProductList } from "../components/ProductList";
import { LanguageSelector } from "../components/LanguageSelector";
import { fetchCategories, fetchProducts } from "../lib/firebase-admin";
import type { Category, Product, Language } from "../types/menu";
import toast from "react-hot-toast";
import logo from "../assets/logo/zeyrek-cafe-logo.svg";
import translations from "../../translations.json";
import { PromoModal } from "../components/PromoModal";

const BACKGROUND_URL = "https://i.ibb.co/q3c0YP8N/arkaplan.webp";

export function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  // localStorage'dan başlat
  const getInitialLanguage = () => {
    return (localStorage.getItem("selectedLanguage") as Language) || "tr";
  };
  const getInitialCategory = () => {
    return localStorage.getItem("selectedCategory") || null;
  };
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    getInitialLanguage()
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    getInitialCategory()
  );
  const [loading, setLoading] = useState(true);
  const [promoOpen, setPromoOpen] = useState(true);

  // Animasyonlu dil başlığı için
  const languagePrompts = [
    { text: "Dili seçiniz", lang: "tr" },
    { text: "Choose language", lang: "en" },
    { text: "اختر اللغة", lang: "ar" },
  ];
  const [promptIndex, setPromptIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const promptTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    promptTimeout.current = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setPromptIndex((prev) => (prev + 1) % languagePrompts.length);
        setFade(true);
      }, 400); // fade out süresi
    }, 2200); // gösterim süresi
    return () => {
      if (promptTimeout.current) clearTimeout(promptTimeout.current);
    };
  }, [promptIndex]);

  // Kategori kaydırma başlığı için
  const categoryPrompts = [
    { text: "Kategorileri kaydırın", lang: "tr" },
    { text: "Scroll categories", lang: "en" },
    { text: "اسحب التصنيفات", lang: "ar" },
  ];
  const [catPromptIndex, setCatPromptIndex] = useState(0);
  const [catFade, setCatFade] = useState(true);
  const catPromptTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    catPromptTimeout.current = setTimeout(() => {
      setCatFade(false);
      setTimeout(() => {
        setCatPromptIndex((prev) => (prev + 1) % categoryPrompts.length);
        setCatFade(true);
      }, 400);
    }, 2200);
    return () => {
      if (catPromptTimeout.current) clearTimeout(catPromptTimeout.current);
    };
  }, [catPromptIndex]);

  // Modal içeriği dil desteği
  const isEnglish = selectedLanguage === "en";
  const promoContent =
    selectedLanguage === "en"
      ? {
          title: "Notte Premium Cold Brew",
          description:
            "World-class beans. Perfectly cold-brewed. Discover the distinct character of three origins: Brazil, Ethiopia, and Colombia. Taste the world, one sip at a time.",
          variants: [
            {
              name: "Brazil",
              description:
                "A smooth profile balancing notes of rich dark chocolate and sweet plum with a kick of sour cherry and a light citrus finish.",
            },
            {
              name: "Ethiopia",
              description:
                "A complex profile blending notes of bright orange and tropical fruits with sweet caramel and a fragrant, aromatic finish.",
            },
            {
              name: "Colombia",
              description:
                "A rich and juicy profile combining notes of ripe passion fruit, sweet orange, and tropical fruits with creamy milk chocolate and a warm, boozy finish.",
            },
          ],
          actionLabel: "Try now",
        }
      : selectedLanguage === "ar"
      ? {
          title: "Notte Premium Cold Brew",
          description:
            "حبوب قهوة من الطراز العالمي. مُحضرة بطريقة الكولد برو المثالية. اكتشف الطابع المميز لثلاثة أصول: البرازيل، إثيوبيا، وكولومبيا. تذوق العالم، رشفة بعد رشفة.",
          variants: [
            {
              name: "Brazil",
              description:
                "بروفايل ناعم يوازن بين نكهات الشوكولاتة الداكنة الغنية والبرقوق الحلو مع لمسة من الكرز الحامض ونهاية خفيفة من الحمضيات.",
            },
            {
              name: "Ethiopia",
              description:
                "بروفايل معقد يمزج بين نكهات البرتقال الزاهي والفواكه الاستوائية مع الكراميل الحلو ونهاية عطرية معطرة.",
            },
            {
              name: "Colombia",
              description:
                "بروفايل غني وعصيري يجمع بين نكهات فاكهة العاطفة الناضجة والبرتقال الحلو والفواكه الاستوائية مع شوكولاتة الحليب الكريمية ونهاية دافئة تشبه المشروبات الروحية.",
            },
          ],
          actionLabel: "جرّب الآن",
        }
      : {
          title: "Notte Cold Brew - Premium Serisi",
          description:
            "Dünyanın en iyi çekirdeklerinden, soğuk demleme ile hazırlanan Notte Cold Brew serimizle tanışın! 3 farklı ülkenin karakteristik lezzetleriyle: Brazil, Ethiopia, Colombia.",
          variants: [
            {
              name: "Brazil",
              description:
                "Yumuşak içim, bitter çikolata, tatlı erik, vişne ve hafif narenciye aromaları.",
            },
            {
              name: "Ethiopia",
              description:
                "Kompleks, portakal, tropik meyveler, karamel, parfümsü aromalar.",
            },
            {
              name: "Colombia",
              description:
                "Olgun çarkıfelek, tatlı portakal, tropik meyveler, sütlü çikolata ve likörsü aromalar.",
            },
          ],
          actionLabel: "Şimdi Deneyin",
        };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCategories, fetchedProducts] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        setCategories(fetchedCategories);
        setProducts(fetchedProducts);

        // Eğer localStorage'da kategori yoksa ilk kategoriyi seç
        if (!getInitialCategory() && fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0].id);
        }
      } catch (error) {
        toast.error(translations.menu_load_error[selectedLanguage]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedLanguage]);

  // Dil değişince localStorage'a yaz
  useEffect(() => {
    localStorage.setItem("selectedLanguage", selectedLanguage);
  }, [selectedLanguage]);

  // Kategori değişince localStorage'a yaz
  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem("selectedCategory", selectedCategory);
    }
  }, [selectedCategory]);

  // Dil değiştiğinde modalı tekrar göster
  useEffect(() => {
    setPromoOpen(true);
  }, [selectedLanguage]);

  const filteredProducts = selectedCategory
    ? products.filter(
        (product) =>
          product.category_id === selectedCategory &&
          (product.is_active ?? true)
      )
    : products.filter((product) => product.is_active ?? true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a2339] to-[#451a2b] p-6 space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#2a304d]/50 rounded w-32"></div>
          <div className="h-12 bg-[#2a304d]/50 rounded-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-[#2a304d]/50 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Promo Modal */}
      <PromoModal
        open={promoOpen}
        onClose={() => setPromoOpen(false)}
        title={promoContent.title}
        description={promoContent.description}
        imageUrl="https://firebasestorage.googleapis.com/v0/b/zeyrek-cafe-qr.firebasestorage.app/o/notte.webp?alt=media"
        variants={promoContent.variants}
        actionLabel={promoContent.actionLabel}
        onAction={() => {
          // 'cold brew' kategorisini bul ve seç
          const coldBrewCat = categories.find(
            (cat) =>
              cat.name_tr.toLowerCase().includes("cold brew") ||
              (cat.name_en && cat.name_en.toLowerCase().includes("cold brew"))
          );
          if (coldBrewCat) {
            setSelectedCategory(coldBrewCat.id);
            setPromoOpen(false);
          }
        }}
      />
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 min-h-full w-full bg-repeat-y bg-[length:100%_auto] sm:bg-cover bg-top"
        style={{
          backgroundImage: `url(${BACKGROUND_URL})`,
          minHeight: "100%",
          height: "auto",
        }}
      >
        <div className="absolute inset-0 min-h-full bg-black/10 h-full" />
      </div>

      {/* Content Container */}
      <div className="relative w-full min-h-screen flex flex-col items-center z-10 px-2 sm:px-4">
        {/* Header Section */}
        <div className="relative w-full flex flex-col items-center pt-4 sm:pt-8 pb-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-[#f7e7d3]/5 to-[#4fa3e3]/5 rounded-full blur-xl" />
            <img
              src={logo}
              alt="Zeyrek Cafe Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 object-contain drop-shadow-2xl relative"
              style={{ maxWidth: "100%" }}
            />
          </div>
          <p className="text-sm sm:text-base md:text-lg font-medium text-[#f7e7d3] mb-2 text-center mt-4 sm:mt-6 max-w-md mx-auto leading-relaxed tracking-wide drop-shadow-lg">
            {translations.tagline[selectedLanguage]}
          </p>
        </div>
        {/* Animasyonlu dil başlığı - dil seçicinin hemen üstünde */}
        <div
          className={`mb-1 h-6 flex items-center justify-center w-full transition-opacity duration-700 ease-in-out ${
            fade ? "opacity-100" : "opacity-0"
          }`}
          dir={languagePrompts[promptIndex].lang === "ar" ? "rtl" : "ltr"}
          aria-live="polite"
        >
          <span
            className="text-base font-normal text-[#f7e7d3] drop-shadow-sm tracking-wide select-none"
            style={{
              letterSpacing:
                languagePrompts[promptIndex].lang === "ar" ? 0 : undefined,
            }}
          >
            {languagePrompts[promptIndex].text}
          </span>
        </div>

        {/* Menu Section */}
        <div className="relative w-full max-w-2xl mx-auto px-0 sm:px-4 pb-8 sm:pb-12">
          {/* Menu Header */}
          <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-2 sm:gap-4 mb-4 sm:mb-8">
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />
          </div>

          {/* Categories and Products */}
          <div className="space-y-4 sm:space-y-8">
            <div className="bg-gradient-to-br from-[#2a4c7d]/20 to-[#2a4c7d]/10 backdrop-blur-[2px] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 shadow-lg border border-white/10 overflow-hidden mx-1 sm:mx-0">
              <CategoryList
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedLanguage={selectedLanguage}
                variant="horizontal"
                showEditLabel={false}
              />
            </div>
            {/* Kategori kaydırma animasyonlu başlık - ALTTA */}
            <div
              className={`mt-1 h-6 flex items-center justify-center w-full transition-opacity duration-700 ease-in-out ${
                catFade ? "opacity-100" : "opacity-0"
              }`}
              aria-live="polite"
            >
              <span className="text-base font-normal text-[#f7e7d3] drop-shadow-sm tracking-wide select-none ml-2">
                {categoryPrompts[catPromptIndex].text}
              </span>
              <span className="text-[#f7e7d3] text-lg select-none">
                &#8594;
              </span>
            </div>

            <div className="relative px-1 sm:px-0">
              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-[#f7e7d3] text-lg">
                    {translations.empty_state[selectedLanguage]}
                  </p>
                </div>
              )}
              <ProductList
                products={filteredProducts}
                selectedLanguage={selectedLanguage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
