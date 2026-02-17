"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Comment {
  id: number;
  message: string;
  isInternal: boolean;
  createdAt: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

interface CommentListProps {
  comments: Comment[];
  projectId: string;
  currentUser: {
    id: string;
    username: string;
    role: string;
  };
}

export function CommentList({
  comments,
  projectId,
  currentUser,
}: CommentListProps) {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentList, setCommentList] = useState(comments);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: newComment.trim(),
        }),
      });

      if (response.ok) {
        const { comment } = await response.json();
        setCommentList([comment, ...commentList]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Pridať komentár..."
          className="min-h-[100px]"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="bg-[#d1fa1a] text-black hover:bg-[#d1fa1a]/90"
          >
            {isSubmitting ? "Pridáva sa..." : "Pridať komentár"}
          </Button>
        </div>
      </form>

      {/* Comments list */}
      <div className="space-y-4">
        {commentList.length === 0 ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
            Zatiaľ nie sú žiadne komentáre.
          </p>
        ) : (
          commentList.map((comment) => (
            <Card
              key={comment.id}
              className="bg-neutral-50 dark:bg-neutral-800"
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#d1fa1a] text-black text-xs font-semibold">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {comment.user.username}
                      </span>
                      <Badge
                        variant={
                          comment.user.role === "admin"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {comment.user.role === "admin" ? "Admin" : "Klient"}
                      </Badge>
                      {comment.isInternal && (
                        <Badge variant="outline" className="text-xs">
                          Interné
                        </Badge>
                      )}
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {new Date(comment.createdAt).toLocaleString("sk-SK")}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {comment.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
