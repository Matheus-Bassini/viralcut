import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const VideoLibrary = () => {
  const { t } = useTranslation();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de vídeos
    setTimeout(() => {
      setVideos([
        {
          id: 1,
          title: 'Vídeo Exemplo 1',
          thumbnail: '/placeholder-video.jpg',
          duration: '00:30',
          createdAt: '2024-01-15',
          status: 'processed'
        },
        {
          id: 2,
          title: 'Vídeo Exemplo 2',
          thumbnail: '/placeholder-video.jpg',
          duration: '01:15',
          createdAt: '2024-01-14',
          status: 'processing'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('videoLibrary.title', 'Biblioteca de Vídeos')}
        </h1>
        <p className="text-gray-600">
          {t('videoLibrary.subtitle', 'Gerencie todos os seus vídeos processados')}
        </p>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('videoLibrary.empty.title', 'Nenhum vídeo encontrado')}
          </h3>
          <p className="text-gray-500 mb-4">
            {t('videoLibrary.empty.description', 'Comece fazendo upload do seu primeiro vídeo')}
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            {t('videoLibrary.empty.uploadButton', 'Fazer Upload')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJMMTc2IDkwTDE0NCAxMDhWNzJaIiBmaWxsPSIjOUI5QkEwIi8+Cjwvc3ZnPgo=';
                  }}
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    video.status === 'processed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {video.status === 'processed' ? 'Processado' : 'Processando...'}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 truncate">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  {new Date(video.createdAt).toLocaleDateString('pt-BR')}
                </p>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition-colors">
                    {t('videoLibrary.actions.edit', 'Editar')}
                  </button>
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-3 rounded transition-colors">
                    {t('videoLibrary.actions.download', 'Download')}
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;
