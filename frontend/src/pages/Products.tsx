import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axiosInstance';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Package, Plus, Edit2, Loader2, Image as ImageIcon, X, Check, ArrowDownToLine, ArrowUpToLine, Tags, Save,
  Trash2, ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface Product {
  id: string; name: string; description: string; price: number; stockQuantity: number; imageUrl: string | null; isActive: boolean; categoryId: string;
}

const getProductSchema = (t: any) => z.object({
  name: z.string().min(2, t("products.nameRequired")),
  description: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().min(0, t("products.negativePrice"))),
  stockQuantity: z.preprocess((val) => Number(val), z.number().min(0, t("products.negativeStock"))),
  imageUrl: z.string().url(t("products.invalidUrl")).or(z.literal("")).optional(),
  categoryId: z.string().min(1, t("products.categoryRequired")),
});

type ProductForm = z.infer<ReturnType<typeof getProductSchema>>;

export default function Products() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  const productSchema = useMemo(() => getProductSchema(t), [t]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['admin-products'], queryFn: async () => (await api.get('/products')).data,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'], queryFn: async () => (await api.get('/products/categories')).data,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: ProductForm) => {
      return editingProduct ? api.put(`/products/${editingProduct.id}`, data) : api.post('/products', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success(editingProduct ? t('products.toastUpdateSuccess') : t('products.toastCreateSuccess'));
      closeModal();
    },
    onError: () => toast.error(t('products.toastSaveError'))
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string, isActive: boolean }) => api.put(`/products/${id}`, { isActive }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-products'] }); toast.success(t('products.toastStatusSuccess')); }
  });

  const quickStockMutation = useMutation({
    mutationFn: async ({ id, newStock }: { id: string, newStock: number }) => api.put(`/products/${id}`, { stockQuantity: newStock }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] })
  });

  const saveCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      return editingCategory ? api.put(`/products/categories/${editingCategory.id}`, { name }) : api.post('/products/categories', { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(editingCategory ? t('products.toastCatUpdateSuccess') : t('products.toastCatCreateSuccess'));
      setCategoryName("");
      setEditingCategory(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.error || t('products.toastCatSaveError'))
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/products/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success(t('products.toastCatDeleteSuccess'));
      setEditingCategory(null);
      setCategoryName("");
      setCategoryToDelete(null);
    },
    onError: (error: any) => toast.error(error.response?.data?.error || t('products.toastCatDeleteError'))
  });

  const handleDeleteCategory = (cat: any) => {
    setCategoryToDelete(cat);
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setValue('name', product.name);
      setValue('description', product.description || "");
      setValue('price', product.price);
      setValue('stockQuantity', product.stockQuantity);
      setValue('imageUrl', product.imageUrl || "");
      setValue('categoryId', product.categoryId);
    } else {
      setEditingProduct(null); reset();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingProduct(null); reset(); };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-amber-500" /></div>;

  return (
    <div className="max-w-6xl mx-auto pt-4 pb-12 animate-in fade-in duration-500">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{t('products.title')}</h1>
            <p className="text-slate-500 font-medium mt-1">{t('products.subtitle')}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-amber-500 hover:text-amber-600 text-slate-600 font-bold px-5 py-3 rounded-xl transition-all active:scale-95"
          >
            <Tags className="w-5 h-5" /> {t('products.categoriesBtn')}
          </button>

          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> {t('products.newProductBtn')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id} className={`bg-white rounded-3xl border ${product.isActive ? 'border-slate-100' : 'border-red-100 bg-red-50/30'} p-5 shadow-sm hover:shadow-md transition-all flex flex-col`}>
            <div className="flex gap-4 items-start mb-4">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden shrink-0 relative">
                {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-slate-300"><ImageIcon className="w-8 h-8" /></div>}
                {!product.isActive && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center"><span className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded">{t('products.inactiveBadge')}</span></div>}
              </div>
              <div className="flex-grow">
                <h3 className="font-black text-slate-900 leading-tight mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-amber-600 font-black text-lg">{product.price} {t('products.currency')}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between mb-4 mt-auto">
              <span className="text-sm font-bold text-slate-500">{t('products.stockLabel')}</span>
              <div className="flex items-center gap-3">
                <button onClick={() => quickStockMutation.mutate({ id: product.id, newStock: Math.max(0, product.stockQuantity - 1) })} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-500 hover:text-red-500 hover:bg-red-50"><ArrowDownToLine className="w-4 h-4" /></button>
                <span className={`font-black text-lg w-8 text-center ${product.stockQuantity < 10 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>{product.stockQuantity}</span>
                <button onClick={() => quickStockMutation.mutate({ id: product.id, newStock: product.stockQuantity + 5 })} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-500 hover:text-green-500 hover:bg-green-50"><ArrowUpToLine className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => openModal(product)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2"><Edit2 className="w-4 h-4" /> {t('products.editBtn')}</button>
              <button onClick={() => toggleStatusMutation.mutate({ id: product.id, isActive: !product.isActive })} className={`w-12 flex justify-center items-center rounded-xl transition-colors ${product.isActive ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'}`}>
                {product.isActive ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-2xl font-black text-slate-900">{editingProduct ? t('products.modalEditTitle') : t('products.modalCreateTitle')}</h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-900 bg-white rounded-full shadow-sm"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('products.productNameLabel')} <span className="text-red-500">*</span></label>
                <input {...register("name")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium" />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('products.descriptionLabel')}</label>
                <textarea {...register("description")} placeholder={t('products.descPlaceholder')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium resize-none h-20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t('products.priceLabel')} <span className="text-red-500">*</span></label>
                  <input type="number" {...register("price")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-black" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">{t('products.stockInputLabel')} <span className="text-red-500">*</span></label>
                  <input type="number" {...register("stockQuantity")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-black" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('products.categoryLabel')} <span className="text-red-500">*</span></label>
                <select {...register("categoryId")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium">
                  {Array.isArray(categories) && categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">{t('products.imageUrlLabel')}</label>
                <input {...register("imageUrl")} placeholder="https://..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 text-sm" />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">{t('products.cancelBtn')}</button>
                <button type="submit" disabled={saveMutation.isPending} className="flex items-center gap-2 px-6 py-2.5 font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md disabled:opacity-50">
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />} {t('products.saveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2"><Tags className="w-6 h-6 text-amber-500" /> {t('products.categoriesBtn')}</h2>
              <button onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); setCategoryName(""); }} className="p-2 text-slate-400 hover:text-slate-900 bg-white rounded-full shadow-sm"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6">
              <div className="flex gap-2 mb-6">
                <input
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder={t('products.catPlaceholder')}
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500 font-medium"
                />
                <button
                  onClick={() => {
                    if (categoryName.trim().length > 1) saveCategoryMutation.mutate(categoryName);
                    else toast.error(t('products.toastCatNameShort'));
                  }}
                  disabled={saveCategoryMutation.isPending}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {editingCategory ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {Array.isArray(categories) && categories.map((cat: any) => (
                  <div key={cat.id} className={`flex justify-between items-center p-3 rounded-xl border ${editingCategory?.id === cat.id ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                    <span className="font-bold text-slate-700 truncate mr-3">{cat.name}</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => { setEditingCategory(cat); setCategoryName(cat.name); }} className="text-amber-500 hover:text-amber-700 p-2 bg-amber-50 rounded-lg transition-colors" title={t('products.editBtn')}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteCategory(cat)} className="text-red-500 hover:text-red-700 p-2 bg-red-50 rounded-lg transition-colors" title={t('products.deleteCancelBtn')}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {categoryToDelete && !deleteCategoryMutation.isPending && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-8 text-center border border-red-100 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200">
              <ShieldAlert className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">{t('products.deleteCatTitle')}</h3>

            <div className="bg-red-50 rounded-2xl p-4 mb-6">
              <p className="text-red-700 font-bold text-sm leading-relaxed">
                {t('products.deleteCatWarning1', { name: categoryToDelete.name, count: products?.filter(p => p.categoryId === categoryToDelete.id).length })}
                <br/>{t('products.deleteCatWarning2')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => deleteCategoryMutation.mutate(categoryToDelete.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                {t('products.deleteConfirmBtn')}
              </button>
              <button
                onClick={() => setCategoryToDelete(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all"
              >
                {t('products.deleteCancelBtn')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}