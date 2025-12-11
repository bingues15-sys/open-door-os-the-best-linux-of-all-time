import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Smile } from 'lucide-react';
import { AppWindowProps } from '../../types';

interface Post {
  id: number;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
}

export const SocialVerse: React.FC<AppWindowProps> = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: 'Sarah Jenkins',
      handle: '@sarahj_dev',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      content: 'Just deployed my first app on Open Door OS! The development experience is incredibly smooth. 🚀 #coding #webdev',
      likes: 42,
      comments: 5,
      time: '2h',
      liked: false
    },
    {
      id: 2,
      author: 'Alex River',
      handle: '@ariver',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150',
      content: 'Does anyone know how to customize the terminal themes? I am looking for something distinct.',
      likes: 12,
      comments: 8,
      time: '4h',
      liked: true
    },
    {
        id: 3,
        author: 'Open Door Official',
        handle: '@opendoor_os',
        avatar: 'https://images.unsplash.com/photo-1531297461136-8208631433e7?w=150',
        content: 'Welcome to the future of web operating systems. Stay tuned for v2.0 updates coming next week! 🌐',
        likes: 1024,
        comments: 156,
        time: '1d',
        liked: false
    }
  ]);
  const [input, setInput] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      author: 'Guest User',
      handle: '@guest',
      avatar: 'https://ui-avatars.com/api/?name=Guest+User&background=random',
      content: input,
      likes: 0,
      comments: 0,
      time: 'Just now',
      liked: false
    };

    setPosts([newPost, ...posts]);
    setInput('');
  };

  const toggleLike = (id: number) => {
      setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  return (
    <div className="flex flex-col h-full bg-black text-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">SocialVerse</h1>
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            <span className="text-xs font-bold text-slate-300">GU</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-xl mx-auto w-full">
            {/* Create Post */}
            <div className="p-4 border-b border-slate-800">
                <form onSubmit={handlePost} className="flex gap-3">
                    <img src="https://ui-avatars.com/api/?name=Guest+User&background=random" className="w-10 h-10 rounded-full" alt="Profile" />
                    <div className="flex-1">
                        <input 
                            className="w-full bg-transparent border-none outline-none text-lg placeholder-slate-600 text-white mb-3 focus:ring-0"
                            placeholder="What's happening?"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 text-blue-400">
                                <button type="button" className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"><ImageIcon size={18} /></button>
                                <button type="button" className="p-2 hover:bg-blue-500/10 rounded-full transition-colors"><Smile size={18} /></button>
                            </div>
                            <button 
                                type="submit"
                                disabled={!input.trim()}
                                className="px-5 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-500/20"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Feed */}
            <div className="pb-20">
                {posts.map(post => (
                    <div key={post.id} className="p-4 border-b border-slate-800 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="flex gap-3">
                            <img src={post.avatar} className="w-10 h-10 rounded-full object-cover bg-slate-800" alt={post.author} />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-white text-sm">{post.author}</span>
                                        <span className="text-slate-500 text-sm">{post.handle}</span>
                                        <span className="text-slate-500 text-sm">·</span>
                                        <span className="text-slate-500 text-sm hover:underline">{post.time}</span>
                                    </div>
                                    <button className="text-slate-500 hover:text-blue-400 p-1 rounded-full hover:bg-blue-500/10 transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                                <p className="mt-1 text-slate-200 whitespace-pre-wrap text-[15px] leading-relaxed">{post.content}</p>
                                <div className="flex justify-between mt-3 text-slate-500 max-w-sm">
                                    <button className="flex items-center gap-2 hover:text-blue-400 group transition-colors">
                                        <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors"><MessageCircle size={18} /></div>
                                        <span className="text-xs group-hover:text-blue-400">{post.comments}</span>
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleLike(post.id); }}
                                        className={`flex items-center gap-2 group transition-colors ${post.liked ? 'text-pink-500' : 'hover:text-pink-500'}`}
                                    >
                                        <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                                            <Heart size={18} fill={post.liked ? "currentColor" : "none"} />
                                        </div>
                                        <span className="text-xs">{post.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-green-400 group transition-colors">
                                        <div className="p-2 rounded-full group-hover:bg-green-500/10 transition-colors"><Share2 size={18} /></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};