import { create } from "zustand";

type State = {
  id?: string;
  isOpen: boolean;
};

type Action = {
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenTransaction = create<State & Action>(set => ({
  isOpen: false,
  onOpen: (id: string) => {
    set({ isOpen: true, id });
  },
  onClose: () => {
    set({ isOpen: false, id: undefined });
  },
}));
