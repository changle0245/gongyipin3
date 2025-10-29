'use client';

import { useCallback, useState } from 'react';
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

import { useTranslations } from '@/i18n/translation-context';
import type { Locale } from '@/i18n/request';
import { AIGeneratedProduct } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UploadedImage {
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  aiData?: AIGeneratedProduct;
  error?: string;
}

type AdminUploadClientProps = {
  locale: Locale;
};

export function AdminUploadClient({ locale }: AdminUploadClientProps) {
  const t = useTranslations();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [autoPublish, setAutoPublish] = useState(true);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: UploadedImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    const newImages: UploadedImage[] = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
      }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleBatchUpload = async () => {
    setUploading(true);

    for (let i = 0; i < images.length; i++) {
      if (images[i].status !== 'pending') continue;

      setImages((prev) => {
        const updated = [...prev];
        updated[i].status = 'processing';
        return updated;
      });

      try {
        const formData = new FormData();
        formData.append('images', images[i].file);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Upload failed');

        const uploadData = await uploadRes.json();
        const imageUrl = uploadData.files[0];

        const aiFormData = new FormData();
        aiFormData.append('image', images[i].file);
        aiFormData.append('autoPublish', autoPublish.toString());

        const aiRes = await fetch('/api/ai-generate', {
          method: 'POST',
          body: aiFormData,
        });

        if (!aiRes.ok) throw new Error('AI generation failed');

        const aiData = await aiRes.json();

        if (autoPublish) {
          const productData = {
            ...aiData.product,
            images: [imageUrl],
          };

          const saveRes = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
          });

          if (!saveRes.ok) throw new Error('Save product failed');
        }

        setImages((prev) => {
          const updated = [...prev];
          updated[i].status = 'success';
          updated[i].aiData = aiData.product;
          return updated;
        });
      } catch (error) {
        console.error('Error processing image:', error);
        setImages((prev) => {
          const updated = [...prev];
          updated[i].status = 'error';
          updated[i].error = error instanceof Error ? error.message : 'Unknown error';
          return updated;
        });
      }
    }

    setUploading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#4b3600]">{t('admin.title')}</h1>
          <p className="text-[#8a5b00]">
            {t('admin.uploadImage')} - AI {t('admin.generating')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin.batchUpload')}</CardTitle>
                <CardDescription>
                  {t('admin.dragDrop')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="cursor-pointer rounded-3xl border-2 border-dashed border-[#f3c572] bg-white/80 p-12 text-center transition hover:border-[#d6960b] hover:bg-[#fff1c9]"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="mx-auto mb-4 h-12 w-12 text-[#d6960b]" />
                  <p className="mb-2 text-[#7a5b00]">
                    {t('admin.dragDrop')}
                  </p>
                  <p className="text-sm text-[#c2932a]">
                    Support: JPG, PNG, WEBP (Max 10MB each)
                  </p>
                  <Input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium text-[#4b3600]">
                      Auto-publish products
                    </Label>
                    <p className="mt-1 text-sm text-[#8a5b00]">
                      AI will generate and publish products immediately
                    </p>
                  </div>
                  <Button
                    variant={autoPublish ? 'default' : 'outline'}
                    onClick={() => setAutoPublish(!autoPublish)}
                  >
                    {autoPublish ? 'ON' : 'OFF'}
                  </Button>
                </div>

                {images.length > 0 && (
                  <div className="mt-6 flex gap-4">
                    <Button
                      onClick={handleBatchUpload}
                      disabled={uploading}
                      size="lg"
                      className="flex-1"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Process {images.length} Images</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setImages([])}
                      disabled={uploading}
                      size="lg"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {images.map((img, index) => (
                  <div key={index} className="group relative">
                    <div className="aspect-square overflow-hidden rounded-2xl border-2 border-[#f3c572] bg-white/80">
                      <img
                        src={img.preview}
                        alt={`Upload ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute top-2 left-2">
                      {img.status === 'pending' && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      {img.status === 'processing' && (
                        <Badge className="bg-[#f4c36a] text-[#4b3600]">
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Processing
                        </Badge>
                      )}
                      {img.status === 'success' && (
                        <Badge className="bg-[#8ecf4b] text-[#214600]">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Success
                        </Badge>
                      )}
                      {img.status === 'error' && (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Error
                        </Badge>
                      )}
                    </div>

                    {img.status === 'pending' && (
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 rounded-full bg-[#7a4c00]/80 p-1 text-white opacity-0 transition group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    {img.aiData && (
                      <div className="mt-3 space-y-1 text-sm text-[#5c3b00]">
                        <p className="font-semibold text-[#4b3600]">{img.aiData.name[locale]}</p>
                        <p className="text-[#8a5b00]">
                          {img.aiData.description[locale]}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <span className="text-[#c2932a]">Category: {img.aiData.category}</span>
                          <span className="text-[#c2932a]">Price: ${img.aiData.specifications.price}</span>
                        </div>
                      </div>
                    )}

                    {img.error && (
                      <p className="mt-2 text-sm text-red-500">{img.error}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-[#4b3600]">How it works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[#7a5b00]">
                <div>
                  <h4 className="mb-1 font-medium text-[#4b3600]">1. Upload Images</h4>
                  <p>
                    Drag & drop or click to select multiple product images
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-[#4b3600]">2. AI Processing</h4>
                  <p>
                    AI analyzes each image and generates product information in 3 languages
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-[#4b3600]">3. Auto Publish</h4>
                  <p>
                    Products are published immediately (you can edit later)
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium text-[#4b3600]">4. AI Learning</h4>
                  <p>
                    AI learns from your edits to improve future generations
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-[#4b3600]">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-[#7a5b00]">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-medium text-[#4b3600]">{images.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending:</span>
                  <span className="font-medium text-[#c2932a]">
                    {images.filter((img) => img.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Processing:</span>
                  <span className="font-medium text-[#d6960b]">
                    {images.filter((img) => img.status === 'processing').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Success:</span>
                  <span className="font-medium text-[#7ab342]">
                    {images.filter((img) => img.status === 'success').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Failed:</span>
                  <span className="font-medium text-red-500">
                    {images.filter((img) => img.status === 'error').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

