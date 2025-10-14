import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { List, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState, useEffect } from 'react';
import NewListModal from './Lists/NewList';
import NewTaskModal from './Tasks/NewTasks';

interface List {
    id: number;
    title: string;
    description: string | null;
    tasks_count?: number;
}
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Props {
    stats?: {
        totalLists: number;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
    };
     lists: List[];
}

export default function Dashboard({ stats = {
    totalLists: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
},
lists}: Props) {

    const [editingList, setEditingList] = useState<List | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className='text-3xl font-black tracking-tight'>Dashboard</h1>
                        <p className='text-muted-foreground mt-1'>Welcome back! Here's your overview</p>
                    </div>
                    <div className='flex gap-2'>
                        <NewListModal
                            editingList={editingList}
                            setEditingList={setEditingList}
                            onClose={() => setModalOpen(false)}
                        />
                        <NewTaskModal 
                        open={isOpen} setOpen={setIsOpen} 
                        editingTask={editingTask} 
                        setEditingTask={setEditingTask} 
                        lists={lists}
                        />
                    </div>
                    
                </div>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                    <Card className='bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-blue-500'>
                                Total Lists
                            </CardTitle>
                            <List className='h-4 w-4 text-blue-500' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-blue-500 mb-2'>{stats.totalLists}</div>
                            <p className='text-xs text-muted-foreground'>Your Tasks Lists</p>
                        </CardContent>
                    </Card>
                    <Card className='bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-green-500'>
                                Total Tasks
                            </CardTitle>
                            <CheckCircle className='h-4 w-4 text-green-500' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-green-500 mb-2'>{stats.totalTasks}</div>
                            <p className='text-xs text-muted-foreground'>All Your Tasks</p>
                        </CardContent>
                    </Card>
                    <Card className='bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-yellow-500/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-yellow-500'>
                                Pending Tasks
                            </CardTitle>
                            <Clock className='h-4 w-4 text-yellow-500' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-yellow-500 mb-2'>{stats.pendingTasks}</div>
                            <p className='text-xs text-muted-foreground'>Tasks to be completed</p>
                        </CardContent>
                    </Card>
                    <Card className='bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20'>
                        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                            <CardTitle className='text-sm font-medium text-purple-500'>
                                Completed Tasks
                            </CardTitle>
                            <AlertCircle className='h-4 w-4 text-purple-500' />
                        </CardHeader>
                        <CardContent>
                            <div className='text-2xl font-bold text-purple-500 mb-2'>{stats.completedTasks}</div>
                            <p className='text-xs text-muted-foreground'>Completed Tasks</p>
                        </CardContent>
                    </Card>
                </div>
                <div className='grid gap-4 md:grid-cols-2'>
                    <Card className='border-primary/20'>
                        <CardHeader>
                            <CardTitle className='text-lg'>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-4'>
                                <Link href={route("lists.index")}>
                                    <Button variant="outline"
                                    className='w-full justify-start'>
                                        <List className='mr-2 h-4 w-4' />
                                        View All Lists
                                    </Button>
                                </Link>
                                <Link href={route('tasks.index')}>
                                    <Button variant="outline"
                                    className='w-full justify-start'>
                                        <CheckCircle className='h-4 w-4' />
                                        View All Tasks
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='border-primary/20'>
                        <CardHeader>
                            <CardTitle className='text-lg'>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-4'>
                                <div className='flex items-center gap-4'>
                                    <div className='rounded-full bg-primary/10 -2'>
                                      <Plus className='h-4 w-4 text-primary' />  
                                    </div>
                                    <div>
                                        <p className='text-sm font-medium'>Welcome to Task Manager</p>
                                        <p className='text-xs text-muted-foreground'>
                                            Get started by creating your first List or Task
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
