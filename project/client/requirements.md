## Packages
recharts | Beautiful data visualizations for agricultural analytics dashboards
date-fns | Date formatting and manipulation for environmental logs and market trends
lucide-react | High-quality iconography for agricultural domain UI

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}
API Endpoints:
The application heavily relies on query parameters for filtering analytical data by `cropId`.
Ensure `cropId` parameters are properly cast to strings when hitting GET endpoints as specified in shared/routes.ts.
