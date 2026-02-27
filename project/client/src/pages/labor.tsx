import { MainLayout } from "@/components/layout/main-layout";
import { useLaborAvailability } from "@/hooks/use-analytics";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, MapPin, DollarSign, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function LaborPage() {
  const { data: labor, isLoading } = useLaborAvailability();

  // Process data for chart: sum available workers and avg wage by region
  const regionData = labor?.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.region === curr.region);
    if (existing) {
      existing.workers += curr.availableWorkers;
      existing.wageSum += curr.dailyWage;
      existing.count += 1;
      existing.avgWage = existing.wageSum / existing.count;
    } else {
      acc.push({ 
        region: curr.region, 
        workers: curr.availableWorkers,
        wageSum: curr.dailyWage,
        count: 1,
        avgWage: curr.dailyWage
      });
    }
    return acc;
  }, []) || [];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Labor Availability & Analytics
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Monitor agricultural workforce capacity and daily wage trends across geographic regions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="rounded-3xl shadow-lg shadow-black/5 border-border/50 bg-card overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/30 pb-5">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-chart-1" />
                <CardTitle>Regional Capacity</CardTitle>
              </div>
              <CardDescription>Available agricultural workers by region</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px]">
                {isLoading ? (
                  <Skeleton className="w-full h-full rounded-xl" />
                ) : regionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip 
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                      />
                      <Bar dataKey="workers" name="Available Workers" radius={[6, 6, 0, 0]}>
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center flex-col text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/50">
                    <Users className="h-10 w-10 mb-3 opacity-30" />
                    <p className="font-medium">No labor data recorded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg shadow-black/5 border-border/50 bg-card overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border/30 pb-5">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-chart-2" />
                <CardTitle>Regional Daily Wages</CardTitle>
              </div>
              <CardDescription>Average daily labor cost by region</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[350px]">
                {isLoading ? (
                  <Skeleton className="w-full h-full rounded-xl" />
                ) : regionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={val => `$${val}`} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis dataKey="region" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--foreground))', fontWeight: 500 }} />
                      <Tooltip 
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                        formatter={(val: number) => [`$${val.toFixed(2)}`, "Avg. Daily Wage"]}
                      />
                      <Bar dataKey="avgWage" name="Avg Wage" fill="hsl(var(--chart-2))" radius={[0, 6, 6, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center flex-col text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/50">
                    <DollarSign className="h-10 w-10 mb-3 opacity-30" />
                    <p className="font-medium">No wage data recorded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl shadow-lg shadow-black/5 border-border/50 bg-card overflow-hidden">
          <CardHeader className="bg-muted/20 border-b border-border/30 pb-5">
            <CardTitle className="text-xl">Detailed Availability Logs</CardTitle>
            <CardDescription>Raw labor data entries across all dates and regions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold text-foreground">Date</TableHead>
                    <TableHead className="font-semibold text-foreground">Region</TableHead>
                    <TableHead className="text-right font-semibold text-foreground">Available Workers</TableHead>
                    <TableHead className="text-right font-semibold text-foreground">Daily Wage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {labor?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(row.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary-border">
                          {row.region}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-display text-base">{row.availableWorkers}</TableCell>
                      <TableCell className="text-right font-display text-base font-medium text-primary">
                        ${row.dailyWage.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!labor || labor.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No logs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
