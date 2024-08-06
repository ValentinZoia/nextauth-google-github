import { fetchAllUsers } from '@/action/user';
import { getSession } from '@/lib/getSession';
import { User } from '@/models/User';
import { redirect } from 'next/navigation';
import React from 'react'

const SettingsPage = async() => {
  const session = await getSession();
  const user  = session?.user;
  if(!user) return redirect('/login')

  if(user?.role !== 'admin') return redirect('/private/dashboard');

  const allUsers = await fetchAllUsers();
  return (
    <div className='container mx-auto p-4'>
        <h1 className='text-xl font-bold mb-4'>users</h1>
        <table className='w-full rounded shadow'>
            <thead>
            <tr className='bg-gray-100 text-left'>
                <th className='p-2'>First Name</th>
                <th className='p-2'>Last Name</th>
                <th className='p-2'>Email</th>
                <th className='p-2'>Role</th>
                <th className='p-2'>Actions</th>

            </tr>
            </thead>
            <tbody>
                {allUsers?.map((user) => (
                    <tr key={user._id} className='border-b'>
                        <td className='p-2'>{user.firstName}</td>
                        <td className='p-2'>{user.lastName}</td>
                        <td className='p-2'>{user.email}</td>
                        <td className='p-2'>{user.role}</td>
                        <td className='p-2'>
                          <form action={ async ()=>{
                            'use server'
                            await User.findByIdAndDelete(user._id as string)
                          }}>
                            <button className='bg-red-500 text-white px-2 py-1 rounded'>Delete</button>
                          </form>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default SettingsPage