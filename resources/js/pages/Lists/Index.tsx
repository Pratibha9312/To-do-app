import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, CheckCircle2, XCircle, List } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types'; 
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import NewListModal from './NewList';


interface List{
    id: number;
    title: string;
    description: string|null;
    tasks_count?: number;
}

interface Props{
    lists: List[],
    flash?: {
        success?: string;
        error?: string;
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lists',
        href: '/lists'
    }
];
 
export default function ListIndex({ lists, flash }: Props){
    // const [isOpen, setIsOpen] = useState(false);
    const [editingList, setEditingList] = useState<List | null>(null);
     const [modalOpen, setModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        if(flash?.success){
            setToastMessage(flash.success);
            setToastType('success');
            setShowToast(true);
        }else if(flash?.error){
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if(showToast){
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return  () => clearTimeout(timer);
        }
    }, [showToast]);

    const { delete: destroy } = useForm();

   const handleEdit = (list: List) => {
    setEditingList(list);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingList(null);
    setModalOpen(true);
  };

  const handleDelete = (listId: number) => {
        destroy(route('lists.destroy', listId));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title='Lists' />
            <div className='flex h-full flex-1 flex-col gap-4 rounded-xl p-4'>
            {showToast && (
                <div
                className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${
                    toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white animate-in fade-in slide-in-from-top-5`}
                >
                {toastType === 'success' ? (
                    <CheckCircle2 className="h-5 w-5" />
                ) : (
                    <XCircle className="h-5 w-5" />
                )}
                <span>{toastMessage}</span>
                </div>
            )}

            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Lists</h1>
                <NewListModal
                    editingList={editingList}
                    setEditingList={setEditingList}
                    onClose={() => setModalOpen(false)}
                />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {lists.map((list) => (
                <Card key={list.id} className='hover:bg-accent/50 transition-colors'>
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-lg font-medium'>{list.title}</CardTitle>
                    <div className='flex gap-2'>
                        <Button 
                            variant="ghost" 
                            size="icon"  
                            onClick={() => handleEdit(list)}>
                                <Pencil className='h-4 w-4' />    
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon"  
                            onClick={() => handleDelete(list.id)}
                            className='text-destructive hover:text-destructive/90'>
                                <Trash2 className='h-4 w-4' />    
                        </Button>
                    </div>
                    </CardHeader>
                    <CardContent> 
                    <p className="text-sm text-muted-foreground">{list.description || 'No Description'}</p>
                    {list.tasks_count !== undefined && (
                        <p className="text-sm text-muted-foreground mt-2">
                        {list.tasks_count} tasks
                        </p>
                    )}
                    </CardContent>
                </Card>
                ))}
            </div>
            </div> 
        </AppLayout>
        );

}

