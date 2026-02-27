import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MainLayout } from "@/components/layout/main-layout";
import { useCrops, useCreateCrop } from "@/hooks/use-crops";
import { insertCropSchema, type InsertCrop } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sprout, Plus, ThermometerSun, Droplets, Clock, ArrowRight } from "lucide-react";

export default function CropsPage() {
  const { data: crops, isLoading } = useCrops();
  const [open, setOpen] = useState(false);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
            <Sprout className="h-8 w-8 text-primary" />
            Crop Management
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Track and manage agricultural species and their optimal growth parameters.
          </p>
        </div>
        <CreateCropDialog open={open} onOpenChange={setOpen} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : crops?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl border border-dashed border-border/80 text-center space-y-4">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
            <Sprout className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">No crops registered yet</h3>
            <p className="text-muted-foreground mt-1">Add your first crop to begin tracking analytics.</p>
          </div>
          <Button onClick={() => setOpen(true)} className="mt-4 rounded-xl shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Add First Crop
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops?.map((crop) => (
            <CropCard key={crop.id} crop={crop} />
          ))}
        </div>
      )}
    </MainLayout>
  );
}

function CropCard({ crop }: any) {
  return (
    <Card className="group overflow-hidden rounded-2xl shadow-lg shadow-black/5 border-border/60 hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col h-full bg-card hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-transparent border-b border-border/30 pb-5">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-display text-foreground group-hover:text-primary transition-colors">
            {crop.name}
          </CardTitle>
          <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {crop.soilType}
          </span>
        </div>
        <CardDescription className="text-sm font-medium mt-1 text-muted-foreground">
          ID: CRP-{crop.id.toString().padStart(4, '0')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center text-xs text-muted-foreground font-semibold uppercase tracking-wider gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Duration
            </div>
            <span className="font-semibold text-foreground text-lg">{crop.growthDurationDays} <span className="text-sm font-normal text-muted-foreground">days</span></span>
          </div>
          
          <div className="flex flex-col gap-1">
            <div className="flex items-center text-xs text-muted-foreground font-semibold uppercase tracking-wider gap-1.5">
              <ThermometerSun className="h-3.5 w-3.5" /> Temp
            </div>
            <span className="font-semibold text-foreground text-lg">{crop.optimalTempMin}° - {crop.optimalTempMax}°<span className="text-sm font-normal text-muted-foreground">C</span></span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center text-xs text-muted-foreground font-semibold uppercase tracking-wider gap-1.5">
              <Droplets className="h-3.5 w-3.5" /> Humidity
            </div>
            <span className="font-semibold text-foreground text-lg">{crop.optimalHumidityMin}% - {crop.optimalHumidityMax}%</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto border-t border-border/30 bg-muted/10">
        <Link href={`/crops/${crop.id}`} className="w-full">
          <Button variant="ghost" className="w-full justify-between hover:bg-primary/10 hover:text-primary group/btn font-semibold">
            View Analytics Dash
            <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function CreateCropDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { mutate: createCrop, isPending } = useCreateCrop();
  
  const form = useForm<InsertCrop>({
    resolver: zodResolver(insertCropSchema),
    defaultValues: {
      name: "",
      growthDurationDays: 90,
      optimalTempMin: 20,
      optimalTempMax: 30,
      optimalHumidityMin: 50,
      optimalHumidityMax: 70,
      soilType: "Loamy",
    },
  });

  function onSubmit(data: InsertCrop) {
    createCrop(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-xl px-6 py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all text-md font-semibold">
          <Plus className="mr-2 h-5 w-5" />
          Register Crop
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-border/50 rounded-3xl">
        <div className="px-6 py-5 bg-gradient-to-br from-muted/50 to-transparent border-b border-border/40">
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Sprout className="text-primary h-6 w-6"/> Register New Crop
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-base">
            Add a new agricultural species to the monitoring platform.
          </DialogDescription>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Crop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Wheat, Tomato" className="h-12 rounded-xl bg-muted/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="growthDurationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Growth Days</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-12 rounded-xl bg-muted/50" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Soil Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Loamy" className="h-12 rounded-xl bg-muted/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-border/50 bg-muted/20">
              <div className="col-span-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Temperature Bounds (°C)</div>
              <FormField
                control={form.control}
                name="optimalTempMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Minimum</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10 rounded-lg" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimalTempMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Maximum</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10 rounded-lg" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border border-border/50 bg-muted/20">
              <div className="col-span-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Humidity Bounds (%)</div>
              <FormField
                control={form.control}
                name="optimalHumidityMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Minimum</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10 rounded-lg" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="optimalHumidityMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Maximum</FormLabel>
                    <FormControl>
                      <Input type="number" className="h-10 rounded-lg" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} className="rounded-xl h-11 px-6">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="rounded-xl h-11 px-8 shadow-md">
                {isPending ? "Creating..." : "Create Crop"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
