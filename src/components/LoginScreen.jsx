import React, { useState } from 'react';
import { loginUser } from '../utils/dbHelpers';

export default function LoginScreen({ onLogin }) {
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!loginData.username.trim() || !loginData.password.trim()) {
            setError('נא למלא שם משתמש וסיסמה');
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const userData = await loginUser(loginData.username, loginData.password);
            onLogin(userData);
        } catch (err) {
            setError(err.message || 'שגיאה בהתחברות. נסו שוב.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div dir="rtl" className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <img
                        src="/logo.png"
                        alt="ספריית שילה"
                        className="mx-auto mb-4 h-20 w-20 rounded-3xl object-cover bg-[#F5EEE3]"
                    />
                    <h1 className="text-2xl font-bold text-stone-800 mb-2">ספריית שִׁלֹה</h1>
                    <p className="text-stone-600">התחברות למערכת</p>
                </div>

                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-lg">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <label className="block">
                            <span className="text-sm font-medium text-stone-700 mb-2 block">שם משתמש</span>
                            <input
                                type="text"
                                value={loginData.username}
                                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                placeholder="הכניסו שם משתמש"
                                autoComplete="username"
                                required
                                disabled={isLoading}
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm font-medium text-stone-700 mb-2 block">סיסמה</span>
                            <input
                                type="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full rounded-xl border border-stone-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                placeholder="הכניסו סיסמה"
                                autoComplete="current-password"
                                required
                                disabled={isLoading}
                            />
                        </label>

                        {error && (
                            <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !loginData.username.trim() || !loginData.password.trim()}
                            className="w-full rounded-xl py-3 bg-emerald-700 text-white font-medium hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                            {isLoading ? "מתחבר..." : "התחברות"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
