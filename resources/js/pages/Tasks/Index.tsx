import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, CheckCircle2, XCircle, List, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types'; 
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';  
import { route } from 'ziggy-js';
import NewTaskModal from './NewTasks';

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
    id:number;
    title: string;
}

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    lists: List[];
    filters: {
        search: string;
        filter: string;
    };
     flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lists',
        href: '/lists'
    }
];

export default function TasksIndex({ tasks, lists, filters, flash }: Props){
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>(filters.filter as 'all' | 'completed' | 'pending');

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

     const  { data, setData, post, put, processing, reset, delete: destroy } = useForm({
        title: '',
        description: '',
        due_date: '',
        list_id: '',
        is_completed: false as boolean,
    });

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setData({
            title: task.title,
            description: task.description || '',
            due_date: task.due_date || '',
            list_id: task.list_id.toString(),
            is_completed: task.is_completed,
        });
        setIsOpen(true);
    };

    const handleDelete = (taskId: number) => {
        destroy(route('tasks.destroy', taskId));
    };

     const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route("tasks.index"), {
            search: searchTerm,
            filter: completionFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
     };

     const handleFilterChange = (value: 'all' | 'completed' | 'pending') => {
        setCompletionFilter(value);
        router.get(route('tasks.index'), {
           search: searchTerm,
            filter: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
     };

     const handlePageChange =(page: number) => {
        router.get(route('tasks.index'), {
            page,
            search: searchTerm,
            filter: completionFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
     };

     return(
        <AppLayout breadcrumbs={breadcrumbs} >
            <Head title='Tasks' />
            <div className='flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-gradient-to-br from-background to-muted/20'>
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
                    <h1 className='text-2xl font-bold tracking-tight'>Tasks</h1>
                    <p className='text-muted-foreground mt-1'>Manage your tasks and stay organized</p>
                    <NewTaskModal 
                        open={isOpen} setOpen={setIsOpen} 
                        editingTask={editingTask} setEditingTask={setEditingTask} 
                        lists={lists}
                    />
                </div>

                <div className='flex gap-4 mb-4'>
                    <form onSubmit={handleSearch} className='relative flex-1'>
                        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                        <Input placeholder='Search tasks...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='pl-10' 
                        />
                    </form>
                    <Select 
                    value={completionFilter}
                    onValueChange={handleFilterChange}
                    >
                        <SelectTrigger className='w-[180px]'>
                            <SelectValue placeholder='Filter by status' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='all'>All Tasks</SelectItem>
                            <SelectItem value='completed'>Completed</SelectItem>
                            <SelectItem value='pending'>Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className='rounded-md border'>
                    <div className='relative w-full overflow-auto'>
                        <table className='w-full caption-bottom text-sm'>
                            <thead className='[&_tr]:border-b'>
                                <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
                                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Title</th>
                                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Description</th>
                                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>List</th>
                                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Due Date</th>
                                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Status</th>
                                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='[&_tr:last-child]:border-0'>
                                    {tasks.data.map((task) => (
                                        <tr key={task.id} className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
                                            <td className='p-4 align-middle font-medium'>{task.title}</td>
                                            <td className='p-4 align-middle max-w-[200px] truncate'>{task.description || 'No Description'}</td>
                                            <td className='p-4 align-middle'>
                                                <div className='flex items-center gap-2'>
                                                    <List className='h-4 w-4 text-muted-foreground' />{task.list.title}</div></td>
                                            <td className='p-4 align-middle'>{task.due_date ?(
                                                <div className='flex items-center gap-2'>
                                                    <Calendar className='h-4 w-4 text-muted-foreground' />
                                                    {new Date(task.due_date).toLocaleDateString()}
                                                </div>
                                            ) : (
                                               <span className='text-muted-foreground'>No due date</span> 
                                            )}</td>
                                            <td className='p-4 align-middle'>{task.is_completed ? (
                                                <div className='flex items-center gap-2 text-green-500'>
                                                    <CheckCircle2 className='h-4 w-4' />
                                                    <span>Completed</span>
                                                </div>
                                            ) : (
                                                <div className='flex items-center gap-2 text-yellow-500'>
                                                    <span>Pending</span>
                                                </div>
                                            )}</td>
                                            <td className='p-4 align-middle text-right'>
                                                <div className='flex justify-end gap-2'>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"  
                                                        className='hover:bg-primary/10 hover:text-primary'
                                                        onClick={() => handleEdit(task)}>
                                                            <Pencil className='h-4 w-4' />    
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"  
                                                        onClick={() => handleDelete(task.id)}
                                                        className='hover:bg-destructive/10 hover:text-destructive'>
                                                            <Trash2 className='h-4 w-4' />    
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {tasks.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className='p-4 text-center text-muted-foreground'>No tasks foreground</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/*Pagination */}
                <div className='flex items-center justify-between px-2'>
                    <div className='text-sm text-muted-foreground'>
                        Showing {tasks.from} to {tasks.to} of {tasks.total} results
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Button variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(tasks.current_page-1)}
                            disabled={tasks.current_page === 1}>
                                <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <div className='flex items-center space-x-1'>
                            {Array.from({length: tasks.last_page }, (_, i) => i + 1).map((page) =>(
                                <Button key={page}
                                variant={page === tasks.current_page ? 'default' : 'outline'}
                                size='icon'
                                onClick={() => handlePageChange(page)}>
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button variant='outline'
                            size='icon'
                            onClick={() => handlePageChange(tasks.current_page + 1)}
                            disabled={tasks.current_page === tasks.last_page}>
                                <ChevronRight className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
     )
}