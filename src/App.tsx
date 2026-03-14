/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Calendar, 
  User, 
  ArrowLeft, 
  ChevronRight, 
  Github, 
  Twitter, 
  Mail,
  Search,
  Tag,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Clock
} from 'lucide-react';
import Markdown from 'react-markdown';
import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import { getAllPosts } from './lib/posts';
import { Post } from './types';
import { cn } from './lib/utils';
import { Languages, ChevronDown } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-black/5 rounded-xl", className)} />
);

const PostSkeleton = () => (
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

const CategorySkeleton = () => (
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

const SidebarSectionSkeleton = () => (
  <div className="bg-black/5 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-6">
    <Skeleton className="w-1/2 h-6" />
    <div className="space-y-4">
      <Skeleton className="w-full h-10 md:h-12" />
      <Skeleton className="w-full h-10 md:h-12" />
      <Skeleton className="w-full h-10 md:h-12" />
    </div>
  </div>
);

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'contact'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const postsPerPage = 5;

  const t = {
    vi: {
      blogTitle: "Minimal Blog",
      posts: "Bài viết",
      searchPlaceholder: "Tìm kiếm bài viết...",
      heroTitle: "Suy nghĩ, ",
      heroHighlight: "Sáng tạo",
      heroSuffix: " & Code.",
      heroDesc: "Một không gian nhỏ để chia sẻ về lập trình, thiết kế và những điều thú vị trong cuộc sống của một lập trình viên.",
      readMore: "Đọc tiếp",
      noPosts: "Không tìm thấy bài viết nào phù hợp.",
      prev: "Trước",
      next: "Sau",
      page: "Trang",
      latest: "Mới nhất",
      popularTags: "Thẻ phổ biến",
      comments: "Bình luận",
      contactTitle: "Liên hệ với tôi",
      contactDesc: "Bạn có câu hỏi hoặc muốn hợp tác? Hãy để lại lời nhắn bên dưới.",
      nameLabel: "Họ tên",
      emailLabel: "Email",
      subjectLabel: "Chủ đề",
      messageLabel: "Nội dung",
      skills: "Kỹ năng của tôi",
      links: "Liên kết",
      home: "Trang chủ",
      contact: "Liên hệ",
      discussion: "Thảo luận",
      discussionDesc: "Chia sẻ suy nghĩ của bạn về blog hoặc bất cứ điều gì.",
      category: "Danh mục",
      categories: "Tất cả danh mục",
      relatedPosts: "Bài viết liên quan",
      seeAll: "Xem tất cả",
      namePlaceholder: "Tên của bạn",
      commentPlaceholder: "Viết bình luận...",
      send: "Gửi",
      sendComment: "Gửi bình luận",
      sending: "Đang gửi...",
      newsletterTitle: "Đăng ký nhận tin",
      newsletterDesc: "Nhận thông báo về các bài viết mới nhất trực tiếp qua email của bạn.",
      emailPlaceholder: "Email của bạn",
      subscribe: "Đăng ký ngay",
      footerDesc: "Một dự án blog mã nguồn mở được xây dựng với React, Tailwind CSS và Markdown. Dễ dàng triển khai và tùy chỉnh."
    },
    en: {
      blogTitle: "Minimal Blog",
      posts: "Posts",
      searchPlaceholder: "Search posts...",
      heroTitle: "Think, ",
      heroHighlight: "Create",
      heroSuffix: " & Code.",
      heroDesc: "A small space to share about programming, design, and interesting things in the life of a developer.",
      readMore: "Read more",
      noPosts: "No matching posts found.",
      prev: "Prev",
      next: "Next",
      page: "Page",
      latest: "Latest",
      popularTags: "Popular Tags",
      comments: "Comments",
      contactTitle: "Contact Me",
      contactDesc: "Have a question or want to collaborate? Leave a message below.",
      nameLabel: "Full Name",
      emailLabel: "Email",
      subjectLabel: "Subject",
      messageLabel: "Message",
      discussion: "Discussion",
      discussionDesc: "Share your thoughts about the blog or anything else.",
      category: "Category",
      categories: "All Categories",
      relatedPosts: "Related Posts",
      seeAll: "See All",
      namePlaceholder: "Your name",
      commentPlaceholder: "Write a comment...",
      send: "Send",
      sendComment: "Send Comment",
      sending: "Sending...",
      newsletterTitle: "Subscribe to Newsletter",
      newsletterDesc: "Get notifications about the latest posts directly to your email.",
      emailPlaceholder: "Your email",
      subscribe: "Subscribe Now",
      footerDesc: "An open-source blog project built with React, Tailwind CSS, and Markdown. Easy to deploy and customize.",
      skills: "My Skills",
      links: "Links",
      home: "Home",
      contact: "Contact"
    }
  }[lang];
  
  // Dynamic state
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      const allPosts = await getAllPosts();
      // Merge categories: Lập trình -> Công nghệ
      const mergedPosts = allPosts.map(p => ({
        ...p,
        category: p.category === 'Lập trình' ? 'Công nghệ' : p.category,
        category_en: p.category_en === 'Programming' ? 'Technology' : p.category_en
      }));
      setPosts(mergedPosts);
      setLoading(false);
    }
    loadPosts();
  }, []);

  // Fetch dynamic data when post changes or on home
  useEffect(() => {
    const slug = selectedPost ? selectedPost.slug : 'global';
    
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
        const likesRes = await fetch(`${baseUrl}api/likes/${slug}`);
        if (!likesRes.ok) throw new Error('API unreachable');
        const likesData = await likesRes.json();
        setLikes(likesData.count);

        const commentsRes = await fetch(selectedPost ? `${baseUrl}api/comments/${slug}` : `${baseUrl}api/comments-global`);
        if (!commentsRes.ok) throw new Error('API unreachable');
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } catch (err) {
        console.warn("Dynamic features (likes/comments) are unavailable in static mode (GitHub Pages).", err);
      }
    };

    fetchData();
  }, [selectedPost]);

  const handleLike = async (action: 'like' | 'dislike') => {
    const slug = selectedPost ? selectedPost.slug : 'global';
    try {
      const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
      const res = await fetch(`${baseUrl}api/likes/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (!res.ok) throw new Error('API unreachable');
      const data = await res.json();
      setLikes(data.count);
    } catch (err) {
      console.warn("Likes are unavailable in static mode.", err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor || !commentContent) return;
    
    setSubmittingComment(true);
    const slug = selectedPost ? selectedPost.slug : 'global';
    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
    const endpoint = selectedPost ? `${baseUrl}api/comments/${slug}` : `${baseUrl}api/comments-global`;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: commentAuthor, content: commentContent })
      });
      
      if (!res.ok) throw new Error('API unreachable');

      // Refresh comments
      const refreshRes = await fetch(endpoint);
      const data = await refreshRes.json();
      setComments(data);
      
      setCommentContent('');
      setSubmittingComment(false);
    } catch (err) {
      console.warn("Comments are unavailable in static mode.", err);
      setSubmittingComment(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const title = lang === 'vi' ? post.title : post.title_en;
    const excerpt = lang === 'vi' ? post.excerpt : post.excerpt_en;
    const tags = lang === 'vi' ? post.tags : post.tags_en;
    const category = lang === 'vi' ? post.category : post.category_en;
    
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const latestPosts = posts.slice(0, 5);
  const allTags = Array.from(new Set(posts.flatMap(p => lang === 'vi' ? p.tags : p.tags_en)));
  
  // Sort categories: Hot ones first, then others alphabetically
  const hotCategories = ['Bản tin', 'Công nghệ', 'Tán gẫu', 'Thư viện'];
  const hotCategoriesEn = ['Daily', 'Technology', 'Chat', 'Library'];
  
  const allCategories = Array.from(new Set(posts.map(p => lang === 'vi' ? p.category : p.category_en)))
    .sort((a, b) => {
      const aIndex = lang === 'vi' ? hotCategories.indexOf(a) : hotCategoriesEn.indexOf(a);
      const bIndex = lang === 'vi' ? hotCategories.indexOf(b) : hotCategoriesEn.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });

  const gridCategories = lang === 'vi' ? hotCategories : hotCategoriesEn;

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-[#fdfcfb] flex items-center justify-center">
  //       <motion.div 
  //         animate={{ rotate: 360 }}
  //         transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  //         className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
  //       />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a] font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => {
              setSelectedPost(null);
              setCurrentView('home');
              setSearchQuery('');
              setSelectedCategory(null);
              setCurrentPage(1);
            }}
            className="text-lg md:text-xl font-bold tracking-tight hover:text-orange-600 transition-colors flex items-center gap-2 shrink-0"
          >
            <BookOpen className="w-5 h-5 text-orange-500" />
            <span>{t.blogTitle}</span>
          </button>
          
          <div className="flex items-center gap-3 md:gap-6 text-[10px] md:text-sm font-sans uppercase tracking-wider text-black/60">
            <button 
              onClick={() => {
                setSelectedPost(null);
                setCurrentView('home');
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
              className={cn("hover:text-black transition-colors whitespace-nowrap", currentView === 'home' && !selectedPost && !selectedCategory && "text-orange-600 font-bold")}
            >
              {t.posts}
            </button>
            
            {/* Categories Dropdown/List in Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <button 
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className={cn(
                  "hover:text-black transition-colors flex items-center gap-1 whitespace-nowrap py-2", 
                  selectedCategory && "text-orange-600 font-bold"
                )}
              >
                {t.category}
                <ChevronDown className={cn("w-3 h-3 opacity-40 transition-transform duration-300", isCategoryMenuOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 pt-2 z-[60]"
                  >
                    <div className="bg-white border border-black/10 shadow-2xl rounded-2xl p-2 min-w-[180px] backdrop-blur-xl">
                      {allCategories.length > 0 ? (
                        allCategories.map(cat => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setSelectedPost(null);
                              setCurrentView('home');
                              setCurrentPage(1);
                              setIsCategoryMenuOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 rounded-xl text-xs hover:bg-black/5 transition-colors flex items-center justify-between group/item",
                              selectedCategory === cat && "bg-orange-50 text-orange-600 font-bold"
                            )}
                          >
                            <span>{cat}</span>
                            {selectedCategory === cat && <div className="w-1 h-1 rounded-full bg-orange-500" />}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-[10px] text-black/40 italic">
                          Loading...
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={() => {
                setSelectedPost(null);
                setCurrentView('contact');
              }}
              className={cn("hover:text-black transition-colors whitespace-nowrap", currentView === 'contact' && "text-orange-600 font-bold")}
            >
              {t.contact}
            </button>
            <div className="flex items-center gap-2 md:gap-4 ml-1 md:ml-4 border-l border-black/10 pl-2 md:pl-4">
              <button 
                onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                className="flex items-center gap-1 md:gap-2 hover:text-orange-600 transition-colors font-bold"
              >
                <Languages className="w-3 h-3 md:w-4 md:h-4" />
                <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
              </button>
              <div className="flex items-center gap-2 md:gap-3">
                <Github className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:text-black transition-colors" />
                <Twitter className="w-3 h-3 md:w-4 md:h-4 cursor-pointer hover:text-black transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {currentView === 'contact' ? (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <header className="mb-10 md:mb-16">
                    <h1 className="text-3xl md:text-7xl font-bold leading-tight mb-4 md:mb-6">
                      {t.contactTitle}
                    </h1>
                    <p className="text-lg md:text-xl text-black/60 max-w-2xl font-sans leading-relaxed">
                      {t.contactDesc}
                    </p>
                  </header>

                  <form className="bg-white border border-black/5 rounded-[32px] p-8 md:p-12 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-4">{t.nameLabel}</label>
                        <input 
                          type="text" 
                          className="w-full bg-black/5 border-none rounded-2xl py-4 px-6 font-sans text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                          placeholder={t.namePlaceholder}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-4">{t.emailLabel}</label>
                        <input 
                          type="email" 
                          className="w-full bg-black/5 border-none rounded-2xl py-4 px-6 font-sans text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                          placeholder={t.emailPlaceholder}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-4">{t.subjectLabel}</label>
                      <input 
                        type="text" 
                        className="w-full bg-black/5 border-none rounded-2xl py-4 px-6 font-sans text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-black/40 ml-4">{t.messageLabel}</label>
                      <textarea 
                        className="w-full bg-black/5 border-none rounded-2xl py-4 px-6 font-sans text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all min-h-[200px]"
                      />
                    </div>
                    <button className="bg-orange-500 text-white font-sans font-bold py-4 px-12 rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                      {t.send}
                    </button>
                  </form>
                </motion.div>
              ) : !selectedPost ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  {/* Hero Section */}
                  <header className="mb-10 md:mb-16">
                    <h1 className="text-3xl md:text-7xl font-bold leading-tight mb-4 md:mb-6">
                      {t.heroTitle} <br />
                      <span className="italic text-orange-600">{t.heroHighlight}</span>{t.heroSuffix}
                    </h1>
                    <p className="text-base md:text-xl text-black/60 max-w-2xl font-sans leading-relaxed">
                      {t.heroDesc}
                    </p>
                    
                    <div className="mt-8 md:mt-10 relative max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                      <input 
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full bg-black/5 border-none rounded-full py-2.5 md:py-3 pl-10 pr-4 font-sans text-sm focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                      />
                    </div>
                  </header>

                  {/* Posts List */}
                  <div className="grid gap-10 md:gap-16">
                    {loading ? (
                      Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
                    ) : (
                      paginatedPosts.map((post, index) => (
                        <motion.article 
                          key={post.slug}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group cursor-pointer"
                          onClick={() => setSelectedPost(post)}
                        >
                          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            <div className="flex-1 space-y-3 md:space-y-4">
                              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[10px] md:text-xs font-sans uppercase tracking-wider font-bold">
                                <span className="px-2 py-0.5 bg-black text-white rounded text-[9px] md:text-[10px]">
                                  {lang === 'vi' ? post.category : post.category_en}
                                </span>
                                <span className="text-orange-600">{format(new Date(post.date), 'dd MMMM, yyyy', { locale: lang === 'vi' ? vi : enUS })}</span>
                              </div>
                              <h2 className="text-xl md:text-3xl font-bold group-hover:text-orange-600 transition-colors leading-snug">
                                {lang === 'vi' ? post.title : post.title_en}
                              </h2>
                              <p className="text-sm md:text-lg text-black/60 leading-relaxed line-clamp-2 md:line-clamp-3">
                                {lang === 'vi' ? post.excerpt : post.excerpt_en}
                              </p>
                              <div className="pt-2 md:pt-4 space-y-3 md:space-y-4">
                                <div className="flex flex-wrap gap-2">
                                  {(lang === 'vi' ? post.tags : post.tags_en).map(tag => (
                                    <span key={tag} className="text-[9px] md:text-[10px] font-sans font-bold uppercase tracking-widest text-black/30">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center gap-2 text-xs md:text-sm font-sans font-bold group-hover:gap-4 transition-all">
                                  {t.readMore} <ChevronRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                            <div className="hidden md:block w-48 h-48 bg-black/5 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shrink-0">
                               <img 
                                src={`https://picsum.photos/seed/${post.slug}/400/400`} 
                                alt={lang === 'vi' ? post.title : post.title_en}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          </div>
                        </motion.article>
                      ))
                    )}
                  </div>

                  {filteredPosts.length === 0 && (
                    <div className="text-center py-20 font-sans text-black/40">
                      {t.noPosts}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 pt-10">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="px-6 py-2 bg-black/5 rounded-full font-sans text-sm font-bold disabled:opacity-30 hover:bg-orange-100 transition-all"
                      >
                        {t.prev}
                      </button>
                      <span className="font-sans text-sm text-black/40">
                        {t.page} {currentPage} / {totalPages}
                      </span>
                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className="px-6 py-2 bg-black/5 rounded-full font-sans text-sm font-bold disabled:opacity-30 hover:bg-orange-100 transition-all"
                      >
                        {t.next}
                      </button>
                    </div>
                  )}

                  {/* Category Grid Section */}
                  {!selectedCategory && searchQuery === '' && (
                    <div className="mt-20 md:mt-32 pt-12 md:pt-20 border-t border-black/5">
                      <h3 className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 flex items-center gap-3">
                        <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                        {t.category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {loading ? (
                          Array.from({ length: 4 }).map((_, i) => <CategorySkeleton key={i} />)
                        ) : (
                          gridCategories.map(cat => {
                            const categoryPosts = posts.filter(p => (lang === 'vi' ? p.category : p.category_en) === cat);
                            if (categoryPosts.length === 0) return null;
                            
                            const featuredPost = categoryPosts[0];
                            const otherPosts = categoryPosts.slice(1, 6); // Show up to 5 links

                            return (
                              <div key={cat} className="bg-white rounded-2xl md:rounded-[32px] border border-black/5 overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all">
                                {/* Featured Post in Category */}
                                <div 
                                  className="relative h-32 md:h-40 cursor-pointer group" // Reduced height from h-40 to h-32 on mobile
                                  onClick={() => setSelectedPost(featuredPost)}
                                >
                                  <img 
                                    src={`https://picsum.photos/seed/${featuredPost.slug}/600/400`} 
                                    alt={lang === 'vi' ? featuredPost.title : featuredPost.title_en}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                                    <span className="px-3 py-1 md:px-4 md:py-1.5 bg-red-600 text-white rounded-full text-[9px] md:text-[11px] font-bold uppercase tracking-wider shadow-lg">
                                      {cat}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="p-4 md:p-6 flex-1 flex flex-col">
                                  <h3 
                                    onClick={() => setSelectedPost(featuredPost)}
                                    className="text-lg font-bold mb-4 cursor-pointer hover:text-orange-600 transition-colors line-clamp-2 leading-tight" // Reduced text size and margin
                                  >
                                    {lang === 'vi' ? featuredPost.title : featuredPost.title_en}
                                  </h3>
                                  
                                  <div className="space-y-2 mb-6 flex-1"> {/* Reduced spacing and margin */}
                                    {otherPosts.map(post => (
                                      <div 
                                        key={post.slug}
                                        onClick={() => setSelectedPost(post)}
                                        className="group cursor-pointer py-2 border-t border-black/5 first:border-t-0" // Reduced padding
                                      >
                                        <h4 className="text-xs text-black/70 group-hover:text-orange-600 transition-colors line-clamp-1 leading-snug"> {/* Reduced text size and line clamp */}
                                          {lang === 'vi' ? post.title : post.title_en}
                                        </h4>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  <button 
                                    onClick={() => setSelectedCategory(cat)}
                                    className="w-full py-2.5 bg-black/5 hover:bg-black/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all" // Reduced padding and text size
                                  >
                                    {t.seeAll}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}

                  {/* Home Discussion */}
                  <div className="mt-20 pt-20 border-t border-black/5">
                    <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                      <MessageSquare className="w-8 h-8 text-orange-500" />
                      {t.discussion}
                    </h3>
                    <p className="text-black/60 mb-8 font-sans">
                      {t.discussionDesc}
                    </p>
                    <CommentSection 
                      comments={comments}
                      author={commentAuthor}
                      content={commentContent}
                      onAuthorChange={setCommentAuthor}
                      onContentChange={setCommentContent}
                      onSubmit={handleSubmitComment}
                      submitting={submittingComment}
                      t={t}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="post"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="max-w-3xl"
                >
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="mb-12 flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-wider hover:text-orange-600 transition-all hover:gap-4"
                    >
                    <ArrowLeft className="w-4 h-4" /> {t.prev}
                  </button>

                  <header className="mb-12 space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-black text-white rounded-full text-[10px] font-sans font-bold uppercase tracking-wider">
                        {lang === 'vi' ? selectedPost.category : selectedPost.category_en}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(lang === 'vi' ? selectedPost.tags : selectedPost.tags_en).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-sans font-bold uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <h1 className="text-3xl md:text-6xl font-bold leading-tight">
                      {lang === 'vi' ? selectedPost.title : selectedPost.title_en}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-sans text-black/50">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(selectedPost.date), 'dd MMMM, yyyy', { locale: lang === 'vi' ? vi : enUS })}
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {selectedPost.author}
                        </div>
                      </div>
                      
                      {/* Interaction Buttons */}
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => handleLike('like')}
                          className="flex items-center gap-2 px-4 py-2 bg-black/5 hover:bg-orange-500 hover:text-white rounded-full transition-all font-sans text-sm font-bold"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          {likes}
                        </button>
                        <button 
                          onClick={() => handleLike('dislike')}
                          className="p-2 bg-black/5 hover:bg-red-500 hover:text-white rounded-full transition-all"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </header>

                  <div className="prose prose-base md:prose-lg prose-orange max-w-none prose-headings:font-sans prose-p:leading-relaxed prose-pre:bg-black/5 prose-pre:text-black prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg">
                    <div className="markdown-body">
                      <Markdown>{lang === 'vi' ? selectedPost.content : selectedPost.content_en}</Markdown>
                    </div>
                  </div>

                  {/* Related Posts Section */}
                  <div className="mt-12 md:mt-20 pt-10 border-t border-black/5">
                    <h3 className="text-xl md:text-2xl font-bold mb-8 flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-orange-500" />
                      {t.relatedPosts}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {posts
                        .filter(p => p.slug !== selectedPost.slug && (
                          p.category === selectedPost.category || 
                          p.tags.some(tag => selectedPost.tags.includes(tag))
                        ))
                        .slice(0, 4)
                        .map(post => (
                          <div 
                            key={post.slug}
                            onClick={() => {
                              setSelectedPost(post);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="group cursor-pointer p-4 rounded-2xl hover:bg-black/5 transition-all border border-transparent hover:border-black/5"
                          >
                            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-orange-600 mb-2">
                              {lang === 'vi' ? post.category : post.category_en}
                            </div>
                            <h4 className="font-bold group-hover:text-orange-600 transition-colors line-clamp-2">
                              {lang === 'vi' ? post.title : post.title_en}
                            </h4>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Post Discussion */}
                  <div className="mt-16 md:mt-20 pt-12 md:pt-20 border-t border-black/5">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                      <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
                      {t.comments}
                    </h3>
                    <CommentSection 
                      comments={comments}
                      author={commentAuthor}
                      content={commentContent}
                      onAuthorChange={setCommentAuthor}
                      onContentChange={setCommentContent}
                      onSubmit={handleSubmitComment}
                      submitting={submittingComment}
                      t={t}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            {loading ? (
              <>
                <SidebarSectionSkeleton />
                <SidebarSectionSkeleton />
                <SidebarSectionSkeleton />
              </>
            ) : (
              <>
                {/* Latest Posts */}
                <section className="bg-black/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                  <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    {t.latest}
                  </h4>
                  <div className="space-y-4"> {/* Reduced spacing from space-y-6 to space-y-4 */}
                    {latestPosts.map(post => (
                      <div 
                        key={post.slug} 
                        className="group cursor-pointer py-1" // Added slight vertical padding
                        onClick={() => {
                          setSelectedPost(post);
                          setCurrentView('home');
                        }}
                      >
                        <div className="text-[10px] font-sans text-black/40 uppercase tracking-wider mb-0.5"> {/* Reduced text size and margin */}
                          {format(new Date(post.date), 'dd/MM/yyyy', { locale: lang === 'vi' ? vi : enUS })}
                        </div>
                        <h5 className="text-sm font-bold group-hover:text-orange-600 transition-colors line-clamp-1"> {/* Reduced text size and line clamp to 1 */}
                          {lang === 'vi' ? post.title : post.title_en}
                        </h5>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Categories List */}
                <section className="bg-black/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                  <h4 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-orange-500" />
                    {t.category}
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "w-full text-left px-4 py-2 rounded-xl text-sm transition-all",
                        !selectedCategory ? "bg-orange-500 text-white font-bold" : "hover:bg-black/5"
                      )}
                    >
                      {t.categories}
                    </button>
                    {allCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setSelectedPost(null);
                          setCurrentView('home');
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 rounded-xl text-sm transition-all",
                          selectedCategory === cat ? "bg-orange-500 text-white font-bold" : "hover:bg-black/5"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Tags Cloud */}
                <section className="bg-black/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
                  <h4 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-orange-500" />
                    {t.popularTags}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button 
                        key={tag}
                        onClick={() => {
                          if (searchQuery === tag) {
                            setSearchQuery('');
                          } else {
                            setSearchQuery(tag);
                            setCurrentPage(1);
                            setSelectedPost(null);
                            setCurrentView('home');
                          }
                        }}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-sans transition-all",
                          searchQuery === tag 
                            ? "bg-orange-500 text-white" 
                            : "bg-white hover:bg-orange-100 text-black/60"
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Newsletter */}
                <section className="bg-orange-500 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white">
                  <h4 className="text-lg md:text-xl font-bold mb-4">{t.newsletterTitle}</h4>
                  <p className="text-white/80 font-sans text-sm mb-6 leading-relaxed">
                    {t.newsletterDesc}
                  </p>
                  <div className="space-y-3">
                    <input 
                      type="email" 
                      placeholder={t.emailPlaceholder}
                      className="w-full bg-white/20 border-none rounded-full py-3 px-4 text-sm placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white/40 transition-all"
                    />
                    <button className="w-full bg-white text-orange-600 font-sans font-bold py-3 rounded-full hover:bg-orange-50 transition-all">
                      {t.subscribe}
                    </button>
                  </div>
                </section>
              </>
            )}
          </aside>
        </div>
      </main>

      <footer className="bg-black text-white py-20 mt-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold mb-6">
              <BookOpen className="w-6 h-6 text-orange-500" />
              <span>Minimal Blog</span>
            </div>
            <p className="text-white/60 font-sans leading-relaxed max-w-sm">
              {t.footerDesc}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 font-sans">
            <div>
              <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-orange-500">{t.links}</h5>
              <ul className="space-y-2 text-sm text-white/60">
                <li><button onClick={() => { setSelectedPost(null); setCurrentView('home'); setCurrentPage(1); }} className="hover:text-white transition-colors">{t.home}</button></li>
                <li><button onClick={() => { setSelectedPost(null); setCurrentView('home'); setCurrentPage(1); }} className="hover:text-white transition-colors">{t.posts}</button></li>
                <li><button onClick={() => { setSelectedPost(null); setCurrentView('contact'); }} className="hover:text-white transition-colors">{t.contact}</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4 uppercase text-xs tracking-widest text-orange-500">Theo dõi</h5>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 text-center text-xs font-sans text-white/40 uppercase tracking-wider">
          © 2026 Minimal Blog. Built with passion.
        </div>
      </footer>
    </div>
  );
}

function CommentSection({ 
  comments, 
  author, 
  content, 
  onAuthorChange, 
  onContentChange, 
  onSubmit,
  submitting,
  t
}: {
  comments: Comment[];
  author: string;
  content: string;
  onAuthorChange: (val: string) => void;
  onContentChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  t: any;
}) {
  return (
    <div className="space-y-12">
      {/* Comment Form */}
      <form onSubmit={onSubmit} className="bg-black/5 rounded-3xl p-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            placeholder={t.namePlaceholder}
            value={author}
            onChange={(e) => onAuthorChange(e.target.value)}
            className="bg-white border-none rounded-2xl py-3 px-4 font-sans text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            required
          />
        </div>
        <textarea 
          placeholder={t.commentPlaceholder}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="w-full bg-white border-none rounded-2xl py-4 px-4 font-sans text-sm outline-none focus:ring-2 focus:ring-orange-500/20 transition-all min-h-[120px]"
          required
        />
        <button 
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 bg-orange-500 text-white font-sans font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-all disabled:opacity-50"
        >
          {submitting ? t.sending : t.sendComment}
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-black/40 font-bold shrink-0">
              {comment.author[0].toUpperCase()}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-bold">{comment.author}</span>
                <span className="text-xs font-sans text-black/30">
                  {format(new Date(comment.created_at), 'HH:mm - dd/MM/yyyy')}
                </span>
              </div>
              <p className="text-black/70 font-sans leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-10 font-sans text-black/30 italic">
            Chưa có bình luận nào. Hãy là người đầu tiên!
          </div>
        )}
      </div>
    </div>
  );
}
