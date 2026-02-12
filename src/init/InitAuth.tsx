import { ReactNode, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../store/auth/authSlice";
import LoadingScreen from "../components/LoadingScreen";
import type { RootState, AppDispatch } from "../store/store";

const InitAuth = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const didRun = useRef(false);

  useEffect(() => {
    if (!didRun.current) {
      dispatch(checkAuth());
      didRun.current = true;
    }
  }, [dispatch]);

  if (loading && !didRun.current) return <LoadingScreen />;

  return children;
};

export default InitAuth;
