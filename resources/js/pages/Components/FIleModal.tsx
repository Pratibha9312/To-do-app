import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileIcon, Download, Trash2, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Swal from 'sweetalert2';

interface File {
  id: number;
  original_name: string;
  path: string;
  url: string;
}

interface FileModalProps {
  open: boolean;
  onClose: () => void;
  file: File | null;
}

export default function FileModal({ open, onClose, file }: FileModalProps) {
  const [content, setContent] = useState<string | null>(null);
  const [isTextFile, setIsTextFile] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // 👈 spinner control

  useEffect(() => {
    if (file && open) {
      const extension = file.original_name.split('.').pop()?.toLowerCase();

      if (['txt', 'md', 'csv', 'json', 'log'].includes(extension || '')) {
        setIsTextFile(true);
        fetch(file.url)
          .then((res) => res.text())
          .then(setContent)
          .catch(() => setContent('Unable to load file content.'));
      } else {
        setIsTextFile(false);
      }

      setImageLoaded(false); // reset when modal opens
    } else {
      setContent(null);
    }
  }, [file, open]);

  if (!file) return null;

  const extension = file.original_name.split('.').pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
  const isPdf = extension === 'pdf';

  const handleDownload = (file: File) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.original_name || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 const handleDelete = () => {
  onClose();

  setTimeout(() => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This file will be permanently deleted!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed && file) {
        router.delete(route('files.destroy', file.id), {
          onSuccess: () => {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
          onError: () => {
            Swal.fire('Error!', 'Something went wrong.', 'error');
          },
        });
      }
    });
  }, 150); 
};


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileIcon className="h-5 w-5 text-muted-foreground" />
            File Preview
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        {/* --- File Preview Section --- */}
        <div className="py-4 max-h-[70vh] overflow-auto flex justify-center items-center relative">
          {isImage ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex justify-center items-center bg-muted/40">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              )}
              <img
                src={file.url}
                alt="File preview"
                onLoad={() => setImageLoaded(true)}
                className={`max-w-full rounded-md transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </>
          ) : isPdf ? (
            <iframe
              src={file.url}
              className="w-full h-[65vh] border rounded-md"
              title="PDF preview"
            />
          ) : isTextFile ? (
            <pre className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap">
              {content ?? 'Loading...'}
            </pre>
          ) : (
            <p className="text-muted-foreground text-sm">
              Preview not available for this file type.
            </p>
          )}
        </div>

        {/* --- Footer Buttons --- */}
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={() => handleDownload(file!)}>
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
