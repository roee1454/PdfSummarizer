import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FileCode, FileImage, File, X } from 'lucide-react';
import { AiFillFilePdf, AiFillFileWord, AiFillFileExcel } from 'react-icons/ai';
import { Button } from './ui/button';

interface FileCardProps {
    file: File;
    handleRemove: () => void;
}

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'txt':
            return <FileText className="text-blue-500" />;
        case 'js':
        case 'ts':
        case 'py':
            return <FileCode className="text-green-500" />;
        case 'pdf':
            return <AiFillFilePdf className="text-red-500" />;
        case 'doc':
        case 'docx':
            return <AiFillFileWord className="text-blue-700" />;
        case 'xls':
        case 'xlsx':
            return <AiFillFileExcel className="text-green-700" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return <FileImage className="text-yellow-500" />;
        default:
            return <File className="text-gray-500" />;
    }
};

export default function FileCard({ file, handleRemove }: FileCardProps) {
    return (
        <Card className='relative min-h-4 rounded-md shadow-lg'>
            <CardHeader className='flex flex-row justify-between items-center px-6 py-4'>
                <div className='flex flex-row justify-start items-center gap-4'>
                    {getFileIcon(file.name)}
                    <div className='flex flex-col'>
                        <CardTitle className='font-semibold text-lg'>{file.name}</CardTitle>
                        <CardDescription className='text-sm text-gray-500'>{(file.size / 1000).toFixed(2)} KB</CardDescription>
                    </div>
                </div>
                <Button variant="ghost" type='button' className='absolute top-2 left-2 p-3 rounded-full' onClick={handleRemove}><X /></Button>
            </CardHeader>
        </Card>
    )
}
