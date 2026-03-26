import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/axiosInstance";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { Loader2, AlertCircle } from "lucide-react";

export default function OrderPage() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-amber-500 gap-4">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-gray-600 font-medium animate-pulse">
          Menü betöltése...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500 gap-4">
        <AlertCircle className="w-12 h-12" />
        <p className="text-gray-800 font-medium">
          Hiba történt a menü betöltésekor. Próbáld újra később!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Aktuális Kínálat
          </h1>
          <p className="text-gray-500 mt-2">
            Válaszd ki a kedvenceidet és rendeld meg sorban állás nélkül!
          </p>
        </div>
      </div>

      {products?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500">
            Jelenleg nincs elérhető termék a büfében.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
