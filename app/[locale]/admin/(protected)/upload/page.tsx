'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from '@/i18n/translation-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { AIGeneratedProduct } from '@/lib/types';

interface UploadedImage {
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  aiData?: AIGeneratedProduct;
  error?: string;
}

export default function AdminUploadPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [autoPublish, setAutoPublish] = useState(true);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }));

    setImages((previous) => [...previous, ...newImages]);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    const newImages: UploadedImage[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
      }));

    setImages((previous) => [...previous, ...newImages]);
  }, []);

  const removeImage = (index: number) => {
    setImages((previous) => {
      const newImages = [...previous];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleBatchUpload = async () => {
    setUploading(true);

    for (let i = 0; i < images.length; i++) {
      if (images[i].status !== 'pending') continue;

      setImages((previous) => {
        const updated = [...previous];
        updated[i].status = 'processing';
        return updated;
      });

      try {
        const formData = new FormData();
        formData.append('images', images[i].file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error('Upload failed');

        const uploadData = await uploadResponse.json();
        const imageUrl = uploadData.files[0];

        const aiFormData = new FormData();
        aiFormData.append('image', images[i].file);
        aiFormData.append('autoPublish', autoPublish.toString());

        const aiResponse = await fetch('/api/ai-generate', {
          method: 'POST',
          body: aiFormData,
        });

        if (!aiResponse.ok) throw new Error('AI generation failed');

        const aiData = await aiResponse.json();

        if (autoPublish) {
          const productData = {
            ...aiData.product,
            images: [imageUrl],
          };

          const saveResponse = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
          });

          if (!saveResponse.ok) throw new Error('Save product failed');
        }

        setImages((previous) => {
          const updated = [...previous];
          updated[i].status = 'success';
          updated[i].aiData = aiData.product;
          return updated;
        });
      } catch (error) {
        console.error('Error processing image:', error);
        setImages((previous) => {
          const updated = [...previous];
          updated[i].status = 'error';
          updated[i].error = error instanceof Error ? error.message : 'Unknown error';
          return updated;
        });
      }
    }

    setUploading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#fff2c2] to-[#fbe49d] p-6 text-[#4b3600] shadow-lg shadow-[#f7d686]/50">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-semibold">
            <Sparkles className="h-7 w-7 text-[#d89b00]" />
            {t('admin.title')}
          </h1>
          <p className="mt-2 text-sm text-[#7a5b00]">
            {t('admin.uploadImage')} · AI {t('admin.generating')}
          </p>
        </div>
        <Badge className="bg-[#fff] text-[#b67900]">{images.length} {t('admin.files')}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.batchUpload')}</CardTitle>
              <CardDescription>{t('admin.dragDrop')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#f3d27a] bg-white/80 p-12 text-center transition hover:border-[#d89b00] hover:bg-[#fff2c2]"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="h-12 w-12 text-[#d89b00]" />
                <p className="text-lg font-medium text-[#4b3600]">{t('admin.dragDrop')}</p>
                <p className="text-sm text-[#8c5800]">Support: JPG, PNG, WEBP (Max 10MB each)</p>
                <Input
                  id="file-input"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-[#fff5cf] p-4 text-sm text-[#6b4600] sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[#4b3600]">Auto-publish products</p>
                  <p className="text-[#8c5800]">AI will generate and publish products immediately</p>
                </div>
                <Button
                  variant={autoPublish ? 'default' : 'outline'}
                  className={autoPublish ? '' : 'border-[#f3d27a] text-[#8c5800]'}
                  onClick={() => setAutoPublish(!autoPublish)}
                  type="button"
                >
                  {autoPublish ? t('admin.autoPublishOn') : t('admin.autoPublishOff')}
                </Button>
              </div>

              <Button
                className="mt-6 w-full"
                onClick={handleBatchUpload}
                disabled={images.length === 0 || uploading}
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('admin.processing')}
                  </span>
                ) : (
                  t('admin.startProcessing')
                )}
              </Button>
            </CardContent>
          </Card>

          {images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.queue')}</CardTitle>
                <CardDescription>{t('admin.queueDescription')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {images.map((image, index) => (
                  <div
                    key={image.preview}
                    className="flex flex-col gap-4 rounded-2xl border border-[#f3d27a]/60 bg-white/80 p-4 shadow-sm md:flex-row"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={image.preview}
                        alt={`Upload preview ${index + 1}`}
                        className="h-24 w-24 rounded-2xl border border-[#f3d27a]/60 object-cover"
                      />
                      <div className="space-y-1 text-sm text-[#6b4600]">
                        <p className="font-semibold text-[#4b3600]">{image.file.name}</p>
                        <p>{(image.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <Badge
                          variant={
                            image.status === 'success'
                              ? 'default'
                              : image.status === 'error'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {t(`admin.status.${image.status}` as const)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col justify-between gap-3">
                      {image.aiData && (
                        <div className="rounded-2xl bg-[#fff2c2] p-3 text-sm text-[#6b4600]">
                          <p className="font-semibold text-[#4b3600]">{image.aiData.name[locale as 'en' | 'zh' | 'ar']}</p>
                          <p className="mt-2 line-clamp-2 text-[#8c5800]">
                            {image.aiData.description[locale as 'en' | 'zh' | 'ar']}
                          </p>
                        </div>
                      )}
                      {image.error && (
                        <p className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 p-3 text-sm text-red-700">
                          <AlertCircle className="h-4 w-4" />
                          {image.error}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" className="self-start text-[#8c5800]" onClick={() => removeImage(index)}>
                      <X className="mr-2 h-4 w-4" />
                      {t('admin.remove')}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.aiSummary')}</CardTitle>
              <CardDescription>{t('admin.aiSummaryHint')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {images.filter((image) => image.aiData).length === 0 ? (
                <p className="rounded-2xl border border-dashed border-[#f3d27a] bg-white/70 p-4 text-sm text-[#8c5800]">
                  {t('admin.aiEmpty')}
                </p>
              ) : (
                images
                  .filter((image) => image.aiData)
                  .map((image, index) => (
                    <div key={`${image.preview}-summary`} className="space-y-3 rounded-2xl bg-[#fff5cf] p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#4b3600]">
                          {image.aiData!.name[locale as 'en' | 'zh' | 'ar']}
                        </p>
                        <Badge className="bg-white text-[#b67900]">
                          #{index + 1}
                        </Badge>
                      </div>
                      <Textarea
                        readOnly
                        value={image.aiData!.description[locale as 'en' | 'zh' | 'ar']}
                      />
                    </div>
                  ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('admin.notes')}</CardTitle>
              <CardDescription>{t('admin.notesDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-[#6b4600]">
              <p>• {t('admin.note1')}</p>
              <p>• {t('admin.note2')}</p>
              <p>• {t('admin.note3')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
