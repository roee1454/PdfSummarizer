import z from 'zod';

export const allowedExtensions = [
    ".js",
    ".ts",
    ".py",
    ".docx",
    ".pdf",
    ".xlsx",
    ".csv",
    ".txt",
    ".json",
];

const maxSizeMB = 10;

export const maxSizeBytes = maxSizeMB * 1024 * 1024;

export const validateFile = (file: File) => {
    if (!file) return;

    const fileExtension =
    "." +
    file.name
    .slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase();
    console.log(fileExtension);
    const fileSize = file.size;
    
    if (!allowedExtensions.includes(`${fileExtension}`)) {
        return new Error(
            `סוג קובץ לא נתמך, נא לעלות מהקבצים הבאים:\n${allowedExtensions.map(extension => `${extension}, `)}`
        );
    }
    
    if (fileSize > maxSizeBytes) {
        return new Error("גודל התקייה הוא מעל המותר (10MB).");
    }
};

export const InputFormSchema = z.object({
    question: z
        .string()
        .min(1, { message: "יש לנסח הודעה ולא לשלוח משימה ריקה" })
        .max(2500, { message: "עברתם את האורך המקסימלי להודעה זו!" }),
    file: z.instanceof(File).nullable()
});

export interface InputFormValues extends z.infer<typeof InputFormSchema> {}