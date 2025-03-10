'use client';

import { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { User } from '@prisma/client';

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
}

export default function SharePostModal({ isOpen, onClose, postId, postTitle }: SharePostModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState('');
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch users to share with
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        setError('Failed to load users. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUsers();
      setError('');
      setSuccess(false);
      setSelectedUser('');
      setMessage('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedUser) {
      setError('Please select a user to share with');
      return;
    }

    setIsSharing(true);
    setError('');

    try {
      const response = await fetch('/api/posts/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          receiverId: selectedUser,
          message: message || '', // Ensure we send empty string instead of undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to share post');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to share post. Please try again.');
      console.error(err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Share Post
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                    aria-label="Close dialog"
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-4">
                    Share "{postTitle}" with another user
                  </p>

                  {error && (
                    <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 p-2 bg-green-50 text-green-700 rounded-md text-sm">
                      Post shared successfully!
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                      Share with
                    </label>
                    <select
                      id="user"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      disabled={loading || isSharing || success}
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                    {loading && <p className="text-sm text-gray-500 mt-1">Loading users...</p>}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message (optional)
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Add a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSharing || success}
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 mr-2"
                    onClick={onClose}
                    disabled={isSharing}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    onClick={handleSubmit}
                    disabled={loading || isSharing || success || !selectedUser}
                  >
                    {isSharing ? 'Sharing...' : 'Share'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 