import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface List {
  id: number;
  title: string;
  description: string | null;
}

interface Props {
  editingList: List | null;
  setEditingList: React.Dispatch<React.SetStateAction<List | null>>;
  onClose: () => void;
}

export default function NewListModal({ editingList, setEditingList, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(editingList !== null);
  }, [editingList]);

  const { data, setData, post, put, processing, reset } = useForm({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (editingList) {
      setData({
        title: editingList.title,
        description: editingList.description || '',
      });
    } else {
      reset();
    }
  }, [editingList, reset, setData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingList) {
      put(route('lists.update', editingList.id), {
        onSuccess: () => {
          setIsOpen(false);
          reset();
          setEditingList(null);
          onClose();
        },
      });
    } else {
      post(route('lists.store'), {
        onSuccess: () => {
          setIsOpen(false);
          reset();
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingList(null); onClose(); } }}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{editingList ? 'Edit List' : 'Create New List'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={processing}>
            {editingList ? 'Update' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
