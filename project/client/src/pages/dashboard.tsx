import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCrops } from "@/hooks/use-crops";
import { useMarketTrends, useLaborAvailability } from "@/hooks/use-analytics";
import { Sprout, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Dashboard() {
  const { data: crops, isLoading: isLoadingCrops } = useCrops();
  const { data: marketTrends, isLoading: isLoadingMarket } = useMarketTrends();
  const { data: labor, isLoading: isLoadingLabor } = useLaborAvailability();

  const activeRegions = new Set(labor?.map(l => l.region)).size || 0;
  const avgWage = labor && labor.length > 0 
    ? labor.reduce((acc, curr) => acc + curr.dailyWage, 0) / labor.length 
    : 0;

  // Process market trend data to show an overall platform market view
  const chartData = marketTrends?.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.date === curr.date);
    if (existing) {
      existing.avgPrice = (existing.avgPrice + curr.pricePerTon) / 2;
    } else {
      acc.push({ date: curr.date, avgPrice: curr.pricePerTon });
    }
    return acc;
  }, [])?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
            Platform Overview
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            High-level metrics and market intelligence across all agricultural assets.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <DashboardMetricCard
            title="Monitored Crops"
            value={isLoadingCrops ? <Skeleton className="h-8 w-16" /> : crops?.length || 0}
            description="Active species tracked"
            icon={Sprout}
            trend="+2 from last month"
          />
          <DashboardMetricCard
            title="Avg. Market Price"
            value={isLoadingMarket ? <Skeleton className="h-8 w-24" /> : `$${chartData[chartData.length - 1]?.avgPrice?.toFixed(2) || '0.00'}`}
            description="Per ton across all markets"
            icon={TrendingUp}
            trend="+5.2% this quarter"
          />
          <DashboardMetricCard
            title="Active Regions"
            value={isLoadingLabor ? <Skeleton className="h-8 w-12" /> : activeRegions}
            description="Labor data points"
            icon={Users}
          />
          <DashboardMetricCard
            title="Avg. Daily Wage"
            value={isLoadingLabor ? <Skeleton className="h-8 w-20" /> : `$${avgWage.toFixed(2)}`}
            description="Across surveyed regions"
            icon={DollarSign}
            trend="-1.4% change"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-lg shadow-black/5 border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Aggregate Market Index</CardTitle>
              </div>
              <CardDescription>Average price per ton across all tracked crops and markets</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[350px] w-full">
                {isLoadingMarket ? (
                  <Skeleton className="w-full h-full rounded-xl" />
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderRadius: '12px',
                          border: '1px solid hsl(var(--border))',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="avgPrice" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center flex-col text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mb-2 opacity-20" />
                    <p>No market data available yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg shadow-black/5 border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl">
            <CardHeader className="border-b border-border/40 bg-muted/20 pb-4">
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Frequent platform operations</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-3">
              <ActionItem title="Register New Crop" desc="Add to tracking database" href="/crops" />
              <ActionItem title="Log Environmental Data" desc="Record latest field readings" href="/crops" />
              <ActionItem title="Update Market Prices" desc="Sync latest regional prices" href="/crops" />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

function DashboardMetricCard({ title, value, description, icon: Icon, trend }: any) {
  return (
    <Card className="rounded-2xl shadow-md shadow-black/5 border-border/60 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div className="flex flex-col mt-3">
          <div className="text-3xl font-display font-bold text-foreground">{value}</div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">{description}</p>
            {trend && <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">{trend}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionItem({ title, desc, href }: any) {
  return (
    <a href={href} className="group p-4 rounded-xl border border-border/50 hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer flex items-center justify-between">
      <div>
        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </div>
      <div className="h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all">
        <TrendingUp className="h-4 w-4" />
      </div>
    </a>
  );
}
