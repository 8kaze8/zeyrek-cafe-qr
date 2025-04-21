import { updateAllProductsToActive } from "../lib/firebase-admin";

const main = async () => {
  try {
    await updateAllProductsToActive();
    console.log("✅ Tüm ürünler aktif olarak işaretlendi");
    process.exit(0);
  } catch (error) {
    console.error("❌ Hata:", error);
    process.exit(1);
  }
};

main();
