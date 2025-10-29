'use client';

import { useState, useCallback } from 'react';
import { useTranslations, useLocale } from '@/i18n/translation-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { AIGeneratedProduct } from '@/lib/types';

interface UploadedImage {
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  aiData?: AIGeneratedProduct;
  error?: string;
}

export default function AdminUploadPageClient() {
  const t = useTranslations();
  const locale = useLocale();
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('admin.title')}</h1>
          <p className="text-zinc-600">
            {t('admin.uploadImage')} - AI {t('admin.generating')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  className="border-2 border-dashed border-zinc-300 rounded-lg p-12 text-center hover:border-zinc-400 transition cursor-pointer"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto text-zinc-400 mb-4" />
                  <p className="text-zinc-600 mb-2">
                    {t('admin.dragDrop')}
                  </p>
                  <p className="text-sm text-zinc-500">
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
                    <Label className="text-base font-medium">
                      Auto-publish products
                    </Label>
                    <p className="text-sm text-zinc-500 mt-1">
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
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Status</CardTitle>
                <CardDescription>Track AI processing progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {images.length === 0 && (
                  <p className="text-sm text-zinc-500 text-center">
                    No images uploaded yet
                  </p>
                )}

                {images.map((image, index) => (
                  <div
                    key={index}
                    className="p-4 border border-zinc-200 rounded-lg relative"
                  >
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-zinc-100 rounded-lg overflow-hidden">
                        <img
                          src={image.preview}
                          alt={`Uploaded preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              image.status === 'success'
                                ? 'default'
                                : image.status === 'error'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {image.status === 'pending' && 'Pending'}
                            {image.status === 'processing' && 'Processing'}
                            {image.status === 'success' && 'Completed'}
                            {image.status === 'error' && 'Failed'}
                          </Badge>
                          {image.status === 'processing' && (
                            <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                          )}
                          {image.status === 'success' && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                          {image.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>

                        {image.aiData && (
                          <div className="space-y-2">
                            <p className="font-medium">{image.aiData.name[locale]}</p>
                            <p className="text-sm text-zinc-500">
                              {image.aiData.description[locale]}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-zinc-500">Category:</span>{' '}
                                {image.aiData.category}
                              </div>
                              <div>
                                <span className="text-zinc-500">Price:</span>{' '}
                                ${image.aiData.specifications.price}
                              </div>
                            </div>
                          </div>
                        )}

                        {image.error && (
                          <p className="text-sm text-red-500">{image.error}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Tips</CardTitle>
                <CardDescription>Maximize generation quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-zinc-600">
                <div>
                  <p className="font-medium text-zinc-900">Image quality</p>
                  <p>Use high-resolution images with good lighting for best results.</p>
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Product details</p>
                  <p>Provide multiple angles to help AI understand the product better.</p>
                </div>
                <div>
                  <p className="font-medium text-zinc-900">Auto publish</p>
                  <p>You can review generated products before publishing by turning this off.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Generated Description</CardTitle>
                <CardDescription>Review and edit before publishing</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="AI generated description will appear here"
                  className="min-h-[120px]"
                  readOnly
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
