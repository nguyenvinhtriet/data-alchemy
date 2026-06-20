/**
 * Loading skeletons. Pulled out of App.tsx so the post-list, category, and
 * sidebar UIs can pull what they need without dragging the app shell along.
 */
import { cn } from '../lib/utils';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse bg-black/5 rounded-xl', className)} />
);

export const PostSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-6 md:gap-8 py-6 md:py-8 border-b border-black/5 last:border-0">
    <div className="flex-1 space-y-4">
      <div className="flex gap-4">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-32 h-4" />
      </div>
      <Skeleton className="w-full h-6 md:h-8" />
      <Skeleton className="w-3/4 h-6 md:h-8" />
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-1/2 h-4" />
      </div>
    </div>
    <Skeleton className="hidden md:block w-48 h-48 rounded-2xl" />
  </div>
);

export const CategorySkeleton = () => (
  <div className="bg-white rounded-2xl md:rounded-[32px] border border-black/5 overflow-hidden flex flex-col h-[380px] md:h-[400px]">
    <Skeleton className="h-32 md:h-40 rounded-none" />
    <div className="p-4 md:p-6 space-y-4 flex-1">
      <Skeleton className="w-3/4 h-6" />
      <div className="space-y-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-full h-4" />
      </div>
      <div className="mt-auto">
        <Skeleton className="w-full h-10" />
      </div>
    </div>
  </div>
);

export const SidebarSectionSkeleton = () => (
  <div className="bg-black/5 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-6">
    <Skeleton className="w-1/2 h-6" />
    <div className="space-y-4">
      <Skeleton className="w-full h-10 md:h-12" />
      <Skeleton className="w-full h-10 md:h-12" />
      <Skeleton className="w-full h-10 md:h-12" />
    </div>
  </div>
);
