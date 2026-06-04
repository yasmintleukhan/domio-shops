import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-[#f5f0e8] mb-4">
          Domio <span className="text-[#C9A84C]">Shops</span>
        </h1>
        <p className="text-[#888880] text-lg mb-12">
          SaaS платформа для Instagram продавцов в Казахстане
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/shop/login"
            className="px-6 py-3 bg-[#C9A84C] text-[#0d0d0d] rounded-xl font-semibold hover:bg-[#b8973b] transition-colors cursor-pointer"
          >
            Панель продавца
          </Link>
          <Link
            href="/founder/login"
            className="px-6 py-3 border border-[#2a2a2a] text-[#f5f0e8] rounded-xl font-semibold hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer"
          >
            Панель основателя
          </Link>
        </div>
      </div>
    </div>
  );
}
