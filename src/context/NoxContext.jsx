import React, { createContext, useContext, useState, useEffect } from 'react';

const NoxContext = createContext();

export const useNox = () => {
  const context = useContext(NoxContext);
  if (!context) throw new Error('useNox must be used within a NoxProvider');
  return context;
};

export const NoxProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/nox-config.json');
        const data = await response.json();
        setConfig(data);
        
        // Apply Branding
        document.title = data.clubName;
        
        const root = document.documentElement;
        root.style.setProperty('--accent-color', data.themeColor);
        root.style.setProperty('--primary-font', data.primaryFont || "'Inter', sans-serif");
        
        const hexToRgb = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '139, 92, 246';
        };
        root.style.setProperty('--accent-glow', `rgba(${hexToRgb(data.themeColor)}, 0.3)`);

        if (data.ui) {
          if (data.ui.iconSize) root.style.setProperty('--nav-icon-size', data.ui.iconSize);
          if (data.ui.borderRadius) root.style.setProperty('--card-radius', data.ui.borderRadius);
        }

        // Dynamic Manifest
        const manifest = {
          name: data.clubName,
          short_name: data.pwa?.shortName || data.clubName,
          description: data.pwa?.description || data.slogan,
          start_url: "/",
          display: data.pwa?.display || "standalone",
          background_color: data.pwa?.backgroundColor || "#05070a",
          theme_color: data.themeColor,
          orientation: data.pwa?.orientation || "portrait",
          icons: [{ src: data.clubLogo, sizes: "192x192", type: "image/svg+xml" }]
        };
        
        const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
        const manifestLink = document.getElementById('nox-manifest');
        if (manifestLink) manifestLink.href = URL.createObjectURL(blob);

        const themeMeta = document.getElementById('nox-theme-color');
        if (themeMeta) themeMeta.content = data.themeColor;

      } catch (error) {
        console.error('[NOX] Context failed to load config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return (
    <NoxContext.Provider value={{ config, loading }}>
      {!loading && children}
    </NoxContext.Provider>
  );
};
