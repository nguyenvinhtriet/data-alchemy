/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { getAllPosts } from './lib/posts';
import type { Post } from './types';
import { Header, type CurrentView } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { PostList } from './components/PostList';
import { PostDetail } from './components/PostDetail';
import { ContactView } from './components/ContactView';
import { DiscussionView } from './components/DiscussionView';
import { NotFoundView } from './components/NotFoundView';
import { translations, type Lang } from './i18n';

type T = (typeof translations)[Lang];

/** Wrapper that pulls `:slug` from the URL, resolves it to a post, or redirects home. */
function PostDetailRoute(props: {
  posts: Post[];
  lang: Lang;
  t: T;
  onBack: () => void;
  onSelectPost: (post: Post) => void;
}) {
  const { slug } = useParams<{ slug: string }>();
  const post = props.posts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/" replace />;
  return (
    <PostDetail
      post={post}
      posts={props.posts}
      lang={props.lang}
      t={props.t}
      onBack={props.onBack}
      onSelectPost={props.onSelectPost}
    />
  );
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lang, setLang] = useState<Lang>('vi');
  const postsPerPage = 5;

  // View state is derived from the URL — single source of truth.
  const currentView: CurrentView = location.pathname.startsWith('/contact')
    ? 'contact'
    : location.pathname.startsWith('/discussion')
      ? 'discussion'
      : 'home';
  const hasSelectedPost = location.pathname.startsWith('/posts/');

  // Navigation helpers (every nav goes through `navigate(...)`).
  const goHome = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setCurrentPage(1);
    navigate('/');
  };
  const goContact = () => navigate('/contact');
  const goBack = () => navigate('/');
  const pickCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    navigate('/');
  };
  const toggleLang = () => setLang(lang === 'vi' ? 'en' : 'vi');
  const selectPost = (post: Post) => navigate(`/posts/${post.slug}`);
  const clearCategory = () => setSelectedCategory(null);
  const handleTagClick = (tag: string) => {
    if (searchQuery === tag) {
      setSearchQuery('');
    } else {
      setSearchQuery(tag);
      setCurrentPage(1);
      navigate('/');
    }
  };
  const onSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const t = translations[lang];

  useEffect(() => {
    async function loadPosts() {
      const allPosts = await getAllPosts();
      // Merge categories: Lập trình -> Công nghệ
      const mergedPosts = allPosts.map((p) => ({
        ...p,
        category: p.category === 'Lập trình' ? 'Công nghệ' : p.category,
        category_en: p.category_en === 'Programming' ? 'Technology' : p.category_en,
      }));
      setPosts(mergedPosts);
      setLoading(false);
    }
    loadPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const title = lang === 'vi' ? post.title : post.title_en;
    const excerpt = lang === 'vi' ? post.excerpt : post.excerpt_en;
    const tags = lang === 'vi' ? post.tags : post.tags_en;
    const category = lang === 'vi' ? post.category : post.category_en;

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      title.toLowerCase().includes(q) ||
      excerpt.toLowerCase().includes(q) ||
      tags.some((tag) => tag.toLowerCase().includes(q));

    const matchesCategory = !selectedCategory || category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  const latestPosts = posts.slice(0, 5);
  const allTags = Array.from(new Set(posts.flatMap((p) => (lang === 'vi' ? p.tags : p.tags_en))));

  const hotCategories = ['Bản tin', 'Công nghệ', 'Tán gẫu', 'Thư viện'];
  const hotCategoriesEn = ['Daily', 'Technology', 'Chat', 'Library'];

  const allCategories = Array.from(
    new Set(posts.map((p) => (lang === 'vi' ? p.category : p.category_en))),
  ).sort((a, b) => {
    const aIndex = lang === 'vi' ? hotCategories.indexOf(a) : hotCategoriesEn.indexOf(a);
    const bIndex = lang === 'vi' ? hotCategories.indexOf(b) : hotCategoriesEn.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.localeCompare(b);
  });

  const gridCategories = lang === 'vi' ? hotCategories : hotCategoriesEn;

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#1a1a1a] font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Keyboard-only skip link — visible only when focused via Tab. */}
      <a href="#main" className="skip-to-content">
        Skip to content
      </a>
      <Header
        currentView={currentView}
        hasSelectedPost={hasSelectedPost}
        selectedCategory={selectedCategory}
        lang={lang}
        t={t}
        allCategories={allCategories}
        onNavigateHome={goHome}
        onNavigateContact={goContact}
        onSelectCategory={pickCategory}
        onToggleLang={toggleLang}
      />

      <main id="main" tabIndex={-1} className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <PostList
                      posts={posts}
                      paginatedPosts={paginatedPosts}
                      filteredPosts={filteredPosts}
                      loading={loading}
                      searchQuery={searchQuery}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      selectedCategory={selectedCategory}
                      gridCategories={gridCategories}
                      lang={lang}
                      t={t}
                      onSearchChange={onSearchChange}
                      onPageChange={setCurrentPage}
                      onSelectPost={selectPost}
                      onSelectCategory={pickCategory}
                    />
                  }
                />
                <Route
                  path="/posts/:slug"
                  element={
                    <PostDetailRoute
                      posts={posts}
                      lang={lang}
                      t={t}
                      onBack={goBack}
                      onSelectPost={selectPost}
                    />
                  }
                />
                <Route path="/discussion" element={<DiscussionView t={t} lang={lang} />} />
                <Route path="/contact" element={<ContactView t={t} />} />
                <Route
                  path="*"
                  element={
                    <NotFoundView
                      recentPosts={latestPosts}
                      lang={lang}
                      t={t}
                      onGoHome={goHome}
                      onSelectPost={selectPost}
                    />
                  }
                />
              </Routes>
            </AnimatePresence>
          </div>

          <Sidebar
            loading={loading}
            latestPosts={latestPosts}
            allCategories={allCategories}
            allTags={allTags}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            lang={lang}
            t={t}
            onSelectPost={selectPost}
            onClearCategory={clearCategory}
            onSelectCategory={pickCategory}
            onTagClick={handleTagClick}
          />
        </div>
      </main>

      <Footer t={t} onNavigateHome={goHome} onNavigateContact={goContact} />
    </div>
  );
}
