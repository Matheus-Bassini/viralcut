import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState({
    firstName: 'Matheus',
    lastName: 'Bassini',
    email: 'suporte@matheusbassini.com.br',
    language: 'pt-BR',
    subscriptionPlan: 'pro',
    avatar: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setUser(formData);
    setIsEditing(false);
    // Aqui você faria a chamada para a API
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('profile.title', 'Meu Perfil')}
          </h1>
          <p className="text-gray-600">
            {t('profile.subtitle', 'Gerencie suas informações pessoais e configurações')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center">
                <div className="mb-4">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full mx-auto object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.subscriptionPlan === 'pro' 
                      ? 'bg-blue-100 text-blue-800'
                      : user.subscriptionPlan === 'business'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.subscriptionPlan.toUpperCase()}
                  </span>
                </div>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors">
                  {t('profile.changeAvatar', 'Alterar Foto')}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {t('profile.personalInfo', 'Informações Pessoais')}
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {t('profile.edit', 'Editar')}
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {t('profile.save', 'Salvar')}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      {t('profile.cancel', 'Cancelar')}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.firstName', 'Nome')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.lastName', 'Sobrenome')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user.lastName}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.email', 'Email')}
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{user.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.language', 'Idioma')}
                  </label>
                  {isEditing ? (
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">
                      {user.language === 'pt-BR' ? 'Português (Brasil)' : 
                       user.language === 'en' ? 'English' : 'Español'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.subscription', 'Plano')}
                  </label>
                  <p className="text-gray-900 capitalize">{user.subscriptionPlan}</p>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {t('profile.security', 'Segurança')}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t('profile.changePassword', 'Alterar Senha')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('profile.changePasswordDesc', 'Atualize sua senha regularmente')}
                    </p>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                    {t('profile.change', 'Alterar')}
                  </button>
                </div>

                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t('profile.twoFactor', 'Autenticação de Dois Fatores')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('profile.twoFactorDesc', 'Adicione uma camada extra de segurança')}
                    </p>
                  </div>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                    {t('profile.enable', 'Ativar')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
