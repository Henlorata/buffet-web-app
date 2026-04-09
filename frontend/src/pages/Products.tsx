import { api } from "@/api/axiosInstance";
import { Product } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Package, Pencil, Save, X } from 'lucide-react';
import { io } from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const socket = io("http://localhost:5000");

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        toast.error("Hiba a betöltéskor");
      }
    };
    loadProducts();

    socket.on("product-quantity-changed", (updatedProduct: Product) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setSelectedProduct((prev) => 
        prev?.id === updatedProduct.id ? updatedProduct : prev
      );
    });

    return () => {
      socket.off("product-quantity-changed");
    };
  }, []);

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedProduct) return;
    const { name, value } = e.target;
    setSelectedProduct({
      ...selectedProduct,
      [name]: name === "price" || name === "stockQuantity" ? Number(value) : value,
    });
  };

  const handleSaveChanges = async () => {
    if (!selectedProduct) return;
    try {
      await api.patch(`/products/${selectedProduct.id}`, selectedProduct);
      toast.success("Termék sikeresen frissítve!");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Hiba történt a mentés során.");
    }
  };

  return (
    <div className="max-w-9xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Termékek <span className="text-amber-500">Kezelése</span>
        </h2>
      </div>

      {products.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <th className="px-6 py-4">Megnevezés</th>
                  <th className="px-6 py-4">Ár</th>
                  <th className="px-6 py-4">Mennyiség</th>
                  <th className="px-6 py-4">Felvétel dátuma</th>
                  <th className="px-6 py-4">Utolsó módosítás</th>
                  <th className="px-6 py-4">Aktív</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr 
                    key={product.id} 
                    onClick={() => handleRowClick(product)}
                    className="hover:bg-amber-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-semibold text-gray-800 group-hover:text-amber-600 transition-colors">
                          <Package className="w-4 h-4 text-amber-500" />
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-400 pl-6">
                          Kategória: <u>{product.category?.name || "Nincs kategória"}</u>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {product.price.toLocaleString()} Ft
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {product.stockQuantity.toLocaleString()} db
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString("hu-HU")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                       {new Date(product.updatedAt).toLocaleDateString("hu-HU")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${product.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {product.isActive ? 'Igen' : 'Nem'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">Jelenleg nincs megjeleníthető termék.</p>
        </div>
      )}

      <div className="text-center md:text-left">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Termék <span className="text-amber-500">Hozzáadása</span>
        </h2>
      </div>

      <div>
        <form action="NewProduct">
          <input type="text" placeholder="Megnevezés" required/>
          <input type="text" placeholder="Kategória" required/>
          <input type="number" placeholder="Ár" required/>
          <input type="number" placeholder="Készlet" required/>
          <input type="text" placeholder="Leírás"/>
          <button type="submit">Hozzáadás</button>
        </form>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl border-none shadow-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Pencil className="w-6 h-6 text-amber-500" />
              Termék <span className="text-amber-500">Szerkesztése</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid gap-6 py-4 flex">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-600 ml-1">Termék neve</Label>
                <Input
                  id="name"
                  name="name"
                  value={selectedProduct.name}
                  onChange={handleInputChange}
                  className="rounded-xl border-gray-200 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-gray-600 ml-1">Ár (Ft)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={selectedProduct.price}
                    onChange={handleInputChange}
                    className="rounded-xl border-gray-200 focus:ring-amber-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stockQuantity" className="text-gray-600 ml-1">Készlet (db)</Label>
                  <Input
                    id="stockQuantity"
                    name="stockQuantity"
                    type="number"
                    value={selectedProduct.stockQuantity}
                    onChange={handleInputChange}
                    className="rounded-xl border-gray-200 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="isActive" className="text-gray-600 ml-1">Leírás</Label>
                <Input
                  id="description"
                  name="description"
                  value={selectedProduct.description || ""}
                  onChange={handleInputChange}
                  className="rounded-xl border-gray-200 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div className="flex justify-center">
                <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 w-fit px-4 py-2">
                  <Label htmlFor="isActive" className="text-sm font-medium leading-none cursor-pointer text-gray-700">Aktív:</Label>
                  <Checkbox
                    id="isActive"
                    name="isActive"
                    className="cursor-pointer"
                    checked={selectedProduct.isActive}
                    onCheckedChange={(checked: boolean) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        isActive: checked,
                      })
                    }
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                 <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Rendszeradatok</p>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-mono text-gray-700">{selectedProduct.id}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Létrehozva:</span>
                    <span className="text-gray-700">{new Date(selectedProduct.createdAt).toLocaleString("hu-HU")}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Utolsó módosítás:</span>
                    <span className="text-gray-700">{new Date(selectedProduct.updatedAt).toLocaleString("hu-HU")}</span>
                 </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              className="rounded-xl border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <X className="w-4 h-4 mr-2" /> Mégse
            </Button>
            <Button 
              onClick={handleSaveChanges}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 mr-2" /> Mentés
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}