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
import { Languages } from 'lucide-react';

interface Comment {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'about'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lang, setLang] = useState<'vi' | 'en'>('vi');
  const postsPerPage = 5;

  const t = {
    vi: {
      blogTitle: "Minimal Blog",
      posts: "Bài viết",
      about: "Về tôi",
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
      aboutTitle: "Chào, tôi là ",
      aboutDesc1: "Tôi là một lập trình viên đam mê xây dựng những sản phẩm số tinh tế và hữu ích. Blog này là nơi tôi ghi lại hành trình khám phá công nghệ, từ những dòng code đầu tiên đến những kiến trúc hệ thống phức tạp.",
      aboutDesc2: "Với tôi, lập trình không chỉ là công việc, mà là một hình thức nghệ thuật để giải quyết các vấn đề thực tế. Tôi tin vào sức mạnh của mã nguồn mở và sự chia sẻ kiến thức trong cộng đồng.",
      skills: "Kỹ năng của tôi",
      links: "Liên kết",
      home: "Trang chủ",
      contact: "Liên hệ",
      discussion: "Thảo luận",
      discussionDesc: "Chia sẻ suy nghĩ của bạn về blog hoặc bất cứ điều gì.",
      category: "Danh mục",
      categories: "Tất cả danh mục",
      namePlaceholder: "Tên của bạn",
      commentPlaceholder: "Viết bình luận...",
      send: "Gửi",
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
      about: "About",
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
      discussion: "Discussion",
      discussionDesc: "Share your thoughts about the blog or anything else.",
      category: "Category",
      categories: "All Categories",
      namePlaceholder: "Your name",
      commentPlaceholder: "Write a comment...",
      send: "Send",
      sending: "Sending...",
      newsletterTitle: "Subscribe to Newsletter",
      newsletterDesc: "Get notifications about the latest posts directly to your email.",
      emailPlaceholder: "Your email",
      subscribe: "Subscribe Now",
      footerDesc: "An open-source blog project built with React, Tailwind CSS, and Markdown. Easy to deploy and customize.",
      aboutTitle: "Hi, I'm ",
      aboutDesc1: "I'm a developer passionate about building elegant and useful digital products. This blog is where I document my journey of exploring technology, from the first lines of code to complex system architectures.",
      aboutDesc2: "To me, programming is not just a job, but an art form to solve real-world problems. I believe in the power of open source and sharing knowledge within the community.",
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
      setPosts(allPosts);
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

  const latestPosts = posts.slice(0, 3);
  const allTags = Array.from(new Set(posts.flatMap(p => lang === 'vi' ? p.tags : p.tags_en)));
  const allCategories = Array.from(new Set(posts.map(p => lang === 'vi' ? p.category : p.category_en)));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfcfb] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a] font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => {
              setSelectedPost(null);
              setCurrentView('home');
              setSearchQuery('');
              setSelectedCategory(null);
              setCurrentPage(1);
            }}
            className="text-xl font-bold tracking-tight hover:text-orange-600 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-orange-500" />
            <span>{t.blogTitle}</span>
          </button>
          
          <div className="flex items-center gap-6 text-sm font-sans uppercase tracking-wider text-black/60">
            <button 
              onClick={() => {
                setSelectedPost(null);
                setCurrentView('home');
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
              className={cn("hover:text-black transition-colors", currentView === 'home' && !selectedPost && !selectedCategory && "text-orange-600 font-bold")}
            >
              {t.posts}
            </button>
            
            {/* Categories Dropdown/List in Menu */}
            <div className="relative group">
              <button className={cn("hover:text-black transition-colors flex items-center gap-1", selectedCategory && "text-orange-600 font-bold")}>
                {t.category}
              </button>
              <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="bg-white border border-black/5 shadow-xl rounded-xl p-2 min-w-[160px]">
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
                        "w-full text-left px-4 py-2 rounded-lg text-xs hover:bg-black/5 transition-colors",
                        selectedCategory === cat && "bg-orange-50 text-orange-600 font-bold"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedPost(null);
                setCurrentView('about');
              }}
              className={cn("hover:text-black transition-colors", currentView === 'about' && "text-orange-600 font-bold")}
            >
              {t.about}
            </button>
            <div className="flex items-center gap-4 ml-4 border-l border-black/10 pl-4">
              <button 
                onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                className="flex items-center gap-2 hover:text-orange-600 transition-colors font-bold"
              >
                <Languages className="w-4 h-4" />
                <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
              </button>
              <div className="flex items-center gap-3">
                <Github className="w-4 h-4 cursor-pointer hover:text-black transition-colors" />
                <Twitter className="w-4 h-4 cursor-pointer hover:text-black transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {currentView === 'about' ? (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <header className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                      {t.aboutTitle} <br />
                      <span className="italic text-orange-600">Triet</span>.
                    </h1>
                    <div className="prose prose-lg prose-orange max-w-none font-sans text-black/70 leading-relaxed">
                      <p>
                        {t.aboutDesc1}
                      </p>
                      <p>
                        {t.aboutDesc2}
                      </p>
                      <h3 className="text-2xl font-bold text-black mt-10 mb-4 font-serif">{t.skills}</h3>
                      <div className="flex flex-wrap gap-3">
                        {['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'SQLite', 'Markdown'].map(skill => (
                          <span key={skill} className="px-4 py-2 bg-black/5 rounded-full text-sm font-bold">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </header>
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
                  <header className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                      {t.heroTitle} <br />
                      <span className="italic text-orange-600">{t.heroHighlight}</span>{t.heroSuffix}
                    </h1>
                    <p className="text-xl text-black/60 max-w-2xl font-sans leading-relaxed">
                      {t.heroDesc}
                    </p>
                    
                    <div className="mt-10 relative max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                      <input 
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full bg-black/5 border-none rounded-full py-3 pl-10 pr-4 font-sans text-sm focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                      />
                    </div>
                  </header>

                  {/* Posts List */}
                  <div className="grid gap-16">
                    {paginatedPosts.map((post, index) => (
                      <motion.article 
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                      >
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-4 text-xs font-sans uppercase tracking-wider font-bold">
                              <span className="px-2 py-0.5 bg-black text-white rounded text-[10px]">
                                {lang === 'vi' ? post.category : post.category_en}
                              </span>
                              <span className="text-orange-600">{format(new Date(post.date), 'dd MMMM, yyyy', { locale: lang === 'vi' ? vi : enUS })}</span>
                            </div>
                            <h2 className="text-3xl font-bold group-hover:text-orange-600 transition-colors leading-snug">
                              {lang === 'vi' ? post.title : post.title_en}
                            </h2>
                            <p className="text-lg text-black/60 leading-relaxed line-clamp-3">
                              {lang === 'vi' ? post.excerpt : post.excerpt_en}
                            </p>
                            <div className="pt-4 space-y-4">
                              <div className="flex flex-wrap gap-2">
                                {(lang === 'vi' ? post.tags : post.tags_en).map(tag => (
                                  <span key={tag} className="text-[10px] font-sans font-bold uppercase tracking-widest text-black/30">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 text-sm font-sans font-bold group-hover:gap-4 transition-all">
                                {t.readMore} <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                          <div className="hidden md:block w-48 h-48 bg-black/5 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                             <img 
                              src={`https://picsum.photos/seed/${post.slug}/400/400`} 
                              alt={lang === 'vi' ? post.title : post.title_en}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                      </motion.article>
                    ))}
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
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                      {lang === 'vi' ? selectedPost.title : selectedPost.title_en}
                    </h1>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm font-sans text-black/50">
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

                  <div className="prose prose-lg prose-orange max-w-none prose-headings:font-serif prose-p:leading-relaxed prose-pre:bg-black/5 prose-pre:text-black prose-blockquote:border-orange-500 prose-blockquote:bg-orange-50/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg">
                    <div className="markdown-body">
                      <Markdown>{lang === 'vi' ? selectedPost.content : selectedPost.content_en}</Markdown>
                    </div>
                  </div>

                  {/* Post Discussion */}
                  <div className="mt-20 pt-20 border-t border-black/5">
                    <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                      <MessageSquare className="w-8 h-8 text-orange-500" />
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
            {/* Latest Posts */}
            <section className="bg-black/5 rounded-3xl p-8">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                {t.latest}
              </h4>
              <div className="space-y-6">
                {latestPosts.map(post => (
                  <div 
                    key={post.slug} 
                    className="group cursor-pointer"
                    onClick={() => {
                      setSelectedPost(post);
                      setCurrentView('home');
                    }}
                  >
                    <div className="text-xs font-sans text-black/40 uppercase tracking-wider mb-1">
                      {format(new Date(post.date), 'dd/MM/yyyy', { locale: lang === 'vi' ? vi : enUS })}
                    </div>
                    <h5 className="font-bold group-hover:text-orange-600 transition-colors line-clamp-2">
                      {lang === 'vi' ? post.title : post.title_en}
                    </h5>
                  </div>
                ))}
              </div>
            </section>

            {/* Categories List */}
            <section className="bg-black/5 rounded-3xl p-8">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
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
            <section className="bg-black/5 rounded-3xl p-8">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
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
            <section className="bg-orange-500 rounded-3xl p-8 text-white">
              <h4 className="text-xl font-bold mb-4">{t.newsletterTitle}</h4>
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
                <li><button onClick={() => { setSelectedPost(null); setCurrentView('about'); }} className="hover:text-white transition-colors">{t.about}</button></li>
                <li><button className="hover:text-white transition-colors">{t.contact}</button></li>
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
