'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, Eye, ArrowRight } from 'lucide-react';

interface BlogCardProps {
    title: string;
    excerpt: string;
    image: string;
    url: string;
    slug: string;
    content?: string;
    initialViews: number;
}

const calculateReadTime = (content?: string): string => {
    if (!content) return "5 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
};

const ViewCounter: React.FC<{ slug: string; initialViews: number }> = ({ slug, initialViews }) => {
    const [views, setViews] = useState(initialViews);

    useEffect(() => {
        const incrementViews = async () => {
            try {
                const response = await fetch(`/api/views/${slug}`, { method: 'POST' });
                const data = await response.json();
                setViews(data.views);
            } catch (error) {
                console.error('Failed to increment view count:', error);
            }
        };
        incrementViews();
    }, [slug]);

    return <span className="flex items-center text-gray-500"><Eye size={16} className="mr-1" /> {views.toLocaleString()} views</span>;
};

const BlogCard: React.FC<BlogCardProps> = ({ title, excerpt, image, url, slug, content, initialViews }) => {
    const readTime = calculateReadTime(content);

    return (
        <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105"
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
        >
            <Image src={image} alt={title} width={400} height={200} className="w-full h-48 object-cover" />
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-700 mb-4">{excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span className="flex items-center"><Clock size={16} className="mr-1" /> {readTime}</span>
                    <ViewCounter slug={slug} initialViews={initialViews} />
                </div>
                <Link href={url} className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold transition duration-300 group">
                    Read More <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

interface FeaturedPostsProps {
    posts: {
        slug: string;
        title: string;
        excerpt: string;
        image: string;
        url: string;
        content?: string;
        initialViews: number;
    }[];
}

const FeaturedPosts: React.FC<FeaturedPostsProps> = ({ posts }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 200
            }
        }
    };

    return (
        <section className="py-16 bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-100 opacity-50"></div>
            <div className="container mx-auto px-4 relative z-10">
                <motion.h2
                    className="text-4xl font-bold mb-12 text-center text-gray-900"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Featured Posts
                </motion.h2>
                <motion.div
                    className={`grid gap-8 ${
                        posts.length === 1 ? 'md:grid-cols-1 max-w-md mx-auto' :
                            posts.length === 2 ? 'md:grid-cols-2 max-w-2xl mx-auto' :
                                'md:grid-cols-3'
                    }`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {posts.map((post) => (
                        <motion.div key={post.slug} variants={itemVariants}>
                            <BlogCard {...post} />
                        </motion.div>
                    ))}
                </motion.div>
                {posts.length < 3 && (
                    <motion.div
                        className="mt-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link href="/blog" className="inline-block bg-purple-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-purple-700 transition duration-300 transform hover:scale-105 hover:shadow-lg">
                            View All Posts
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default FeaturedPosts;