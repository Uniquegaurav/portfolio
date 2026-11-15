import { Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html
      as='div'
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <span className='canvas-loader'></span>
      <p
        style={{
          fontSize: 14,
          color: "#e7f2f4",
          fontWeight: 800,
          marginTop: 40,
        }}
      >
        {Math.round(progress)}%
      </p>
    </Html>
  );
};

export default CanvasLoader;
