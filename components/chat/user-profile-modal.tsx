"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  Video, 
  Mail, 
  Calendar,
  MapPin,
  Edit3,
  Save,
  X,
  Camera
} from "lucide-react";
import type { User } from "@/lib/types";

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  isOwnProfile?: boolean;
  onUpdateProfile?: (data: Partial<User>) => void;
}

export function UserProfileModal({ 
  user, 
  isOpen, 
  onClose, 
  isOwnProfile = false,
  onUpdateProfile 
}: UserProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: "",
    phone: "",
    location: "",
  });

  if (!user) return null;

  const handleSave = () => {
    onUpdateProfile?.(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user.username,
      email: user.email,
      bio: "",
      phone: "",
      location: "",
    });
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{isOwnProfile ? "My Profile" : "Contact Info"}</span>
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              >
                {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">
                  {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && isEditing && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={user.isOnline ? "default" : "secondary"}>
                {user.isOnline ? "Online" : "Offline"}
              </Badge>
              {user.lastSeen && !user.isOnline && (
                <span className="text-sm text-muted-foreground">
                  Last seen {new Date(user.lastSeen).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          <Separator />

          {/* Profile Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              {isEditing ? (
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              ) : (
                <p className="text-sm font-medium mt-1">{user.username}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>
              )}
            </div>

            {isEditing && (
              <>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <>
              <Separator />
              <div className="flex space-x-2">
                <Button className="flex-1" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button className="flex-1" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
              </div>
            </>
          )}

          {/* Save/Cancel Buttons for Editing */}
          {isOwnProfile && isEditing && (
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}