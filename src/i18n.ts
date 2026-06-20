/**
 * Centralized translation strings.
 *
 * Add a new language by adding a new top-level key with the same shape as `vi`.
 * `as const` gives us literal string types so `Lang` and translation keys are
 * narrowed for autocomplete in callers.
 */
export const translations = {
  vi: {
    blogTitle: 'Data Alchemy',
    posts: 'Bài viết',
    searchPlaceholder: 'Tìm kiếm bài viết...',
    heroTitle: 'Suy nghĩ, ',
    heroHighlight: 'Sáng tạo',
    heroSuffix: ' & Code.',
    heroDesc:
      'Một không gian nhỏ để chia sẻ về lập trình, thiết kế và những điều thú vị trong cuộc sống của một lập trình viên.',
    readMore: 'Đọc tiếp',
    noPosts: 'Không tìm thấy bài viết nào phù hợp.',
    prev: 'Trước',
    next: 'Sau',
    page: 'Trang',
    latest: 'Mới nhất',
    popularTags: 'Thẻ phổ biến',
    comments: 'Bình luận',
    contactTitle: 'Liên hệ với tôi',
    contactDesc: 'Bạn có câu hỏi hoặc muốn hợp tác? Hãy để lại lời nhắn bên dưới.',
    nameLabel: 'Họ tên',
    emailLabel: 'Email',
    subjectLabel: 'Chủ đề',
    messageLabel: 'Nội dung',
    skills: 'Kỹ năng của tôi',
    links: 'Liên kết',
    home: 'Trang chủ',
    contact: 'Liên hệ',
    discussion: 'Thảo luận',
    discussionDesc: 'Chia sẻ suy nghĩ của bạn về blog hoặc bất cứ điều gì.',
    category: 'Danh mục',
    categories: 'Tất cả danh mục',
    relatedPosts: 'Bài viết liên quan',
    seeAll: 'Xem tất cả',
    namePlaceholder: 'Tên của bạn',
    commentPlaceholder: 'Viết bình luận...',
    send: 'Gửi',
    sendComment: 'Gửi bình luận',
    sending: 'Đang gửi...',
    newsletterTitle: 'Đăng ký nhận tin',
    newsletterDesc: 'Nhận thông báo về các bài viết mới nhất trực tiếp qua email của bạn.',
    emailPlaceholder: 'Email của bạn',
    subscribe: 'Đăng ký ngay',
    footerDesc:
      'Một dự án blog mã nguồn mở được xây dựng với React, Tailwind CSS và Markdown. Dễ dàng triển khai và tùy chỉnh.',
    minRead: 'phút đọc',
    aboutAuthor: 'Về tác giả',
    newerPost: 'Bài mới hơn',
    olderPost: 'Bài cũ hơn',
    follow: 'Theo dõi',
    notFoundTitle: 'Lạc đường rồi?',
    notFoundDesc:
      'Trang bạn tìm không tồn tại — có thể đường dẫn đã thay đổi hoặc bài viết đã bị gỡ. Thử quay về trang chủ hoặc xem các bài mới nhất bên dưới.',
    backHome: 'Về trang chủ',
    copyLink: 'Sao chép link',
    linkCopied: 'Đã sao chép',
  },
  en: {
    blogTitle: 'Data Alchemy',
    posts: 'Posts',
    searchPlaceholder: 'Search posts...',
    heroTitle: 'Think, ',
    heroHighlight: 'Create',
    heroSuffix: ' & Code.',
    heroDesc:
      'A small space to share about programming, design, and interesting things in the life of a developer.',
    readMore: 'Read more',
    noPosts: 'No matching posts found.',
    prev: 'Prev',
    next: 'Next',
    page: 'Page',
    latest: 'Latest',
    popularTags: 'Popular Tags',
    comments: 'Comments',
    contactTitle: 'Contact Me',
    contactDesc: 'Have a question or want to collaborate? Leave a message below.',
    nameLabel: 'Full Name',
    emailLabel: 'Email',
    subjectLabel: 'Subject',
    messageLabel: 'Message',
    skills: 'My Skills',
    links: 'Links',
    home: 'Home',
    contact: 'Contact',
    discussion: 'Discussion',
    discussionDesc: 'Share your thoughts about the blog or anything else.',
    category: 'Category',
    categories: 'All Categories',
    relatedPosts: 'Related Posts',
    seeAll: 'See All',
    namePlaceholder: 'Your name',
    commentPlaceholder: 'Write a comment...',
    send: 'Send',
    sendComment: 'Send Comment',
    sending: 'Sending...',
    newsletterTitle: 'Subscribe to Newsletter',
    newsletterDesc: 'Get notifications about the latest posts directly to your email.',
    emailPlaceholder: 'Your email',
    subscribe: 'Subscribe Now',
    footerDesc:
      'An open-source blog project built with React, Tailwind CSS, and Markdown. Easy to deploy and customize.',
    minRead: 'min read',
    aboutAuthor: 'About the author',
    newerPost: 'Newer post',
    olderPost: 'Older post',
    follow: 'Follow',
    notFoundTitle: 'Off the map',
    notFoundDesc:
      "The page you're looking for doesn't exist — the link may have changed or the post was removed. Try heading home or browsing the latest posts below.",
    backHome: 'Back home',
    copyLink: 'Copy link',
    linkCopied: 'Copied',
  },
} as const;

export type Lang = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)['vi'];

/** Convenience: return the translation map for a given language. */
export function getT(lang: Lang) {
  return translations[lang];
}
