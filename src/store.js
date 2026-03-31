import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Zustand Store per lo Stato Globale ad Alta Frequenza e Disconnessione
export const useNoxStore = create(
  persist(
    (set, get) => ({
      // --- Customer State ---
      hasEntered: false,
      entryTime: null,
      liveDuration: 0,
      userTable: null,
      prAssigned: 'Nessuno',

      // --- Actions Customer ---
      setCustomerEntry: (table, pr) =>
        set({
          hasEntered: true,
          entryTime: Date.now(),
          liveDuration: 1, // Parte da 1 minuto
          userTable: table,
          prAssigned: pr,
        }),
        
      setCustomerExit: () =>
        set({
          hasEntered: false,
          entryTime: null,
          liveDuration: 0,
          userTable: null,
        }),
        
      updateLiveDuration: () => {
        const { entryTime, hasEntered } = get();
        if (hasEntered && entryTime) {
          const durationMins = Math.max(1, Math.round((Date.now() - entryTime) / 60000));
          set({ liveDuration: durationMins });
        }
      },

      // --- Network / Offline State ---
      isOffline: false,
      setOfflineStatus: (status) => set({ isOffline: status }),

      // --- System Config ---
      emergencyMode: false,
      setEmergencyMode: (status) => set({ emergencyMode: status }),
      
      clearSystem: () => set({
        hasEntered: false,
        entryTime: null,
        liveDuration: 0,
        userTable: null,
      })
    }),
    {
      name: 'nox-zustand-store', // persist in localStorage automatica
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        hasEntered: state.hasEntered, 
        entryTime: state.entryTime, 
        userTable: state.userTable 
      }), // Persiste solo questi campi tra un riavvio e l'altro
    }
  )
);
