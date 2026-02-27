import { useRoute } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { useCrop } from "@/hooks/use-crops";
import { useMarketTrends, useEnvironmentalLogs, useCropResources } from "@/hooks/use-analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Leaf, DollarSign, Thermometer, Droplets, MapPin, Target, ShieldAlert, Sparkles, Box } from "lucide-react";

export default function CropDetailsPage() {
  const [, params] = useRoute("/crops/:id");
  const cropId = params?.id;
  
  const { data: crop, isLoading: isLoadingCrop } = useCrop(Number(cropId));
  const { data: marketTrends, isLoading: isLoadingMarket } = useMarketTrends(cropId);
  const { data: envLogs, isLoading: isLoadingEnv } = useEnvironmentalLogs(cropId);
  const { data: resources, isLoading: isLoadingRes } = useCropResources(cropId);

  if (isLoadingCrop) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full rounded-3xl" />
          <Skeleton className="h-[500px] w-full rounded-3xl" />
        </div>
      </MainLayout>
    );
  }

  if (!crop) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <h2 className="text-2xl font-bold">Crop not found</h2>
        </div>
      </MainLayout>
    );
  }

  // Format data for Recharts
  const marketData = marketTrends?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  const envData = envLogs?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl p-8 md:p-10">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
            <Leaf className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-primary-foreground border-primary-foreground/30 bg-white/10 backdrop-blur-md">
                  ID: {crop.id}
                </Badge>
                <Badge variant="outline" className="text-primary-foreground border-primary-foreground/30 bg-white/10 backdrop-blur-md">
                  {crop.soilType} Soil
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2">
                {crop.name} Analytics
              </h1>
              <p className="text-primary-foreground/80 text-lg max-w-xl">
                Comprehensive tracking of environmental conditions, market valuation, and resource application.
              </p>
            </div>

            <div className="flex gap-4 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="text-center px-4">
                <p className="text-xs uppercase tracking-wider text-primary-foreground/70 mb-1">Growth Time</p>
                <p className="text-2xl font-bold font-display">{crop.growthDurationDays} <span className="text-base font-normal">days</span></p>
              </div>
              <div className="w-px bg-white/20"></div>
              <div className="text-center px-4">
                <p className="text-xs uppercase tracking-wider text-primary-foreground/70 mb-1">Opt. Temp</p>
                <p className="text-2xl font-bold font-display">{crop.optimalTempMin}° - {crop.optimalTempMax}°</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start h-14 bg-muted/50 p-1 rounded-2xl mb-6">
            <TabsTrigger value="overview" className="rounded-xl px-8 data-[state=active]:bg-card data-[state=active]:shadow-sm text-base">Dashboard</TabsTrigger>
            <TabsTrigger value="resources" className="rounded-xl px-8 data-[state=active]:bg-card data-[state=active]:shadow-sm text-base">Resources applied</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Market Trends Chart */}
              <Card className="rounded-3xl shadow-lg shadow-black/5 border-border/50 overflow-hidden bg-card">
                <CardHeader className="bg-muted/20 border-b border-border/30 pb-5">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-chart-2" />
                    <CardTitle>Market Price Trends</CardTitle>
                  </div>
                  <CardDescription>Historical price per ton across regional markets</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[350px]">
                    {isLoadingMarket ? (
                      <Skeleton className="w-full h-full rounded-xl" />
                    ) : marketData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={marketData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Line type="monotone" name="Price/Ton" dataKey="pricePerTon" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyChart icon={DollarSign} text="No market data recorded" />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Logs Chart */}
              <Card className="rounded-3xl shadow-lg shadow-black/5 border-border/50 overflow-hidden bg-card">
                <CardHeader className="bg-muted/20 border-b border-border/30 pb-5">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-chart-4" />
                    <CardTitle>Environmental Monitoring</CardTitle>
                  </div>
                  <CardDescription>Temperature and humidity logs during growth</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[350px]">
                    {isLoadingEnv ? (
                      <Skeleton className="w-full h-full rounded-xl" />
                    ) : envData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={envData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorHum" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                          <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={val => `${val}°`} />
                          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={val => `${val}%`} />
                          <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }} />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Area yAxisId="left" type="monotone" name="Temp (°C)" dataKey="temperature" stroke="hsl(var(--chart-4))" fill="url(#colorTemp)" strokeWidth={2} />
                          <Area yAxisId="right" type="monotone" name="Humidity (%)" dataKey="humidity" stroke="hsl(var(--chart-3))" fill="url(#colorHum)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <EmptyChart icon={Thermometer} text="No environmental logs recorded" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="focus-visible:outline-none focus-visible:ring-0">
            <Card className="rounded-3xl shadow-lg shadow-black/5 border-border/50 bg-card overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/30">
                <CardTitle className="text-2xl">Crop Inputs & Resources</CardTitle>
                <CardDescription>Pesticides, fertilizers, and seeds formulated for this crop.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingRes ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                ) : resources && resources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {resources.map((resource: any) => (
                      <div key={resource.id} className="relative group rounded-2xl border border-border p-6 bg-card hover:shadow-xl hover:border-primary/50 transition-all duration-300">
                        <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl rounded-tr-2xl text-white font-bold text-xs uppercase tracking-wider
                          ${resource.resourceType === 'pesticide' ? 'bg-destructive/80' : 
                            resource.resourceType === 'fertilizer' ? 'bg-chart-5' : 'bg-primary'}`}>
                          {resource.resourceType}
                        </div>
                        
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                          {resource.resourceType === 'pesticide' && <ShieldAlert className="w-6 h-6 text-destructive" />}
                          {resource.resourceType === 'fertilizer' && <Sparkles className="w-6 h-6 text-chart-5" />}
                          {resource.resourceType === 'seed' && <Sprout className="w-6 h-6 text-primary" />}
                          {!['pesticide', 'fertilizer', 'seed'].includes(resource.resourceType) && <Box className="w-6 h-6 text-muted-foreground" />}
                        </div>
                        
                        <h3 className="font-bold text-lg mb-1 text-foreground">{resource.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{resource.description}</p>
                        
                        <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Rate: <span className="text-foreground">{resource.applicationRate}</span></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyChart icon={Box} text="No resources mapped to this crop yet." />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function EmptyChart({ icon: Icon, text }: any) {
  return (
    <div className="flex h-full w-full items-center justify-center flex-col text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/50">
      <Icon className="h-10 w-10 mb-3 opacity-30" />
      <p className="font-medium">{text}</p>
    </div>
  );
}
