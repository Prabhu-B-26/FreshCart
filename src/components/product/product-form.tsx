"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Product } from "@/lib/types";
import { Upload } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  price: z.coerce.number().positive("Price must be a positive number."),
  quantity: z.coerce.number().int().min(0, "Quantity can't be negative."),
  imageUrl: z.string().url("Must be a valid URL."),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (data: ProductFormValues) => Promise<void>;
}

export default function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const defaultImageUrl = initialData?.imageUrl || `https://picsum.photos/seed/${initialData?.name || 'new'}/400/300`;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
        name: initialData.name,
        price: initialData.price,
        quantity: initialData.quantity,
        imageUrl: initialData.imageUrl,
    } : {
      name: "",
      price: 0,
      quantity: 0,
      imageUrl: defaultImageUrl,
    },
  });

  const imageUrlValue = form.watch("imageUrl");

  const handleFormSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);
    await onSubmit(values);
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <FormLabel>Product Image</FormLabel>
                <div className="mt-2 aspect-square w-full border-2 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden">
                    {imageUrlValue ? (
                        <Image src={imageUrlValue} alt="Product image preview" fill className="object-cover" />
                    ) : (
                        <div className="text-center p-4">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Image preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="md:col-span-2 space-y-4">
                 <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/image.png" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Organic Avocados" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" placeholder="9.99" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                     <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Quantity (Stock)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="100" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <Button type="submit" className="bg-accent hover:bg-accent/90" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Product"}
                </Button>
            </div>
        </div>
      </form>
    </Form>
  );
}
