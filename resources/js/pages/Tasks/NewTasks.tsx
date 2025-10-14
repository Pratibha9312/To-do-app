import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Plus } from 'lucide-react';

interface Task {
    id: number;
    title: string;
    description: string|null;
    is_completed: boolean;
    due_date: string|null;
    list_id: number;
    list: {
        id: number;
        title: string;
    }
}

interface List {
  id: number;
  title: string;
}

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editingTask: Task | null;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
  lists: List[];
}

export default function NewTaskModal({ open, setOpen, editingTask, setEditingTask, lists }: Props) {
  const { data, setData, post, put, processing, reset } = useForm({
    title: '',
    description: '',
    due_date: '',
    list_id: '',
    is_completed: false,
  });

  // Load data into form when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setData({
        title: editingTask.title,
        description: editingTask.description || '',
        due_date: editingTask.due_date || '',
        list_id: editingTask.list_id.toString(),
        is_completed: editingTask.is_completed,
      });
    } else {
      reset();
    }
  }, [editingTask, setData, reset]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editingTask) {
      put(route('tasks.update', editingTask.id), {
        onSuccess: () => {
          setOpen(false);
          reset();
          setEditingTask(null);
        },
      });
    } else {
      post(route('tasks.store'), {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              required
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="list_id">List</Label>
            <Select value={data.list_id} onValueChange={(value) => setData('list_id', value)}>
              <SelectTrigger className="focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select a list" />
              </SelectTrigger>
              <SelectContent>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id.toString()}>
                    {list.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={data.due_date}
              onChange={(e) => setData('due_date', e.target.value)}
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_completed"
              checked={data.is_completed}
              onChange={(e) => setData('is_completed', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-primary"
            />
            <Label htmlFor="is_completed">Completed</Label>
          </div>

          <Button
            type="submit"
            disabled={processing}
            className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg"
          >
            {editingTask ? 'Update' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
