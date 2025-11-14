import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types'; 
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import NewTaskModal from './NewTasks';
import FileModal from '../Components/FIleModal';

