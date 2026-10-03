'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAuthToken, getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/api';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!getAuthToken()) { router.replace('/auth/signin'); return; }
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    try {
      setCategories(await getCategories());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsCreating(true);
    try {
      const category = await createCategory(newName.trim());
      setCategories((prev) => [...prev, category].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName('');
      toast.success(`Category "${category.name}" created`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create category');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingName.trim()) return;
    setActionLoading(`edit-${id}`);
    try {
      const updated = await updateCategory(id, editingName.trim());
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? updated : c)).sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingId(null);
      toast.success('Category updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!confirm(`Delete "${category.name}"? Posts in this category will become uncategorized.`)) return;
    setActionLoading(`delete-${category.id}`);
    try {
      await deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      toast.success('Category deleted');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="text-slate-500">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-slate-900">Categories</h1>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="flex gap-2 mb-8">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="flex-1"
        />
        <Button type="submit" disabled={isCreating || !newName.trim()}>
          {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          <span className="ml-1.5">Add</span>
        </Button>
      </form>

      {/* List */}
      {categories.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 rounded-xl">
          <p className="text-slate-400">No categories yet. Create one above.</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`flex items-center gap-3 px-4 py-3 ${index !== categories.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50 transition-colors`}
            >
              {editingId === category.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 h-8 text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit(category.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <Button
                    variant="ghost" size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    onClick={() => handleSaveEdit(category.id)}
                    disabled={actionLoading === `edit-${category.id}`}
                  >
                    {actionLoading === `edit-${category.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-slate-900">{category.name}</span>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-700" onClick={() => handleEdit(category)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(category)}
                    disabled={actionLoading === `delete-${category.id}`}
                  >
                    {actionLoading === `delete-${category.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
