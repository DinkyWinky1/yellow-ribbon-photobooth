"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";

const filterOptions = [
  {
    id: "original",
    name: "Original",
    effect: "none",
  },
  {
    id: "warm",
    name: "Warm",
    effect: "sepia(0.22) saturate(1.25) brightness(1.05)",
  },
  {
    id: "black-white",
    name: "B&W",
    effect: "grayscale(1) contrast(1.08)",
  },
  {
    id: "vintage",
    name: "Vintage",
    effect: "sepia(0.5) saturate(0.85) contrast(0.95)",
  },
  {
    id: "vivid",
    name: "Vivid",
    effect: "saturate(1.45) contrast(1.1)",
  },
] as const;

const layoutOptions = [
  {
    id: "strip",
    name: "Classic Strip",
    description: "Four full photos in a vertical branded strip.",
    shots: 4,
  },
  {
    id: "grid",
    name: "Square Grid",
    description: "Four photos arranged in a clean 2 × 2 grid.",
    shots: 4,
  },
  {
    id: "polaroid",
    name: "Polaroid Style",
    description: "One large photo with a meaningful message.",
    shots: 1,
  },
  {
    id: "event",
    name: "Event Exclusive",
    description: "A special three-photo Yellow Ribbon collage.",
    shots: 3,
  },
] as const;

type FilterId = (typeof filterOptions)[number]["id"];
type LayoutId = (typeof layoutOptions)[number]["id"];
type Screen = "home" | "layouts" | "camera" | "review" | "download";

function LayoutPreview({ layoutId }: { layoutId: LayoutId }) {
  const photoStyle =
    "rounded-md bg-gradient-to-br from-yellow-100 via-white to-yellow-200";

  if (layoutId === "strip") {
    return (
      <div className="mx-auto grid h-36 w-16 grid-rows-4 gap-1 rounded-lg bg-white p-1.5 shadow-md">
        <div className={photoStyle} />
        <div className={photoStyle} />
        <div className={photoStyle} />
        <div className={photoStyle} />
      </div>
    );
  }

  if (layoutId === "grid") {
    return (
      <div className="mx-auto grid h-32 w-32 grid-cols-2 grid-rows-2 gap-1.5 rounded-xl bg-white p-2 shadow-md">
        <div className={photoStyle} />
        <div className={photoStyle} />
        <div className={photoStyle} />
        <div className={photoStyle} />
      </div>
    );
  }

  if (layoutId === "polaroid") {
    return (
      <div className="mx-auto h-36 w-28 rotate-2 rounded-sm bg-white p-2 pb-7 shadow-md">
        <div className={`h-full w-full ${photoStyle}`} />
      </div>
    );
  }

  return (
    <div className="mx-auto grid h-32 w-32 grid-cols-2 grid-rows-2 gap-1.5 rounded-xl bg-white p-2 shadow-md">
      <div className={`${photoStyle} row-span-2`} />
      <div className={photoStyle} />
      <div className={photoStyle} />
    </div>
  );
}

function BackgroundDecoration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl" />
      <div className="absolute right-[-100px] top-[12%] h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute bottom-[-140px] left-[35%] h-96 w-96 rounded-full bg-yellow-100/70 blur-3xl" />
      <div className="absolute left-[8%] top-[24%] h-3 w-3 rotate-45 rounded-sm bg-yellow-400/50" />
      <div className="absolute right-[12%] top-[18%] h-5 w-5 rotate-12 rounded-md bg-yellow-400/40" />
      <div className="absolute bottom-[18%] left-[15%] h-4 w-4 rotate-45 rounded-sm bg-amber-300/40" />
      <div className="absolute bottom-[12%] right-[20%] h-3 w-3 rounded-full bg-yellow-500/30" />
    </div>
  );
}

function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#fff9df] text-neutral-900"
      style={{
        backgroundImage:
          "radial-gradient(circle at 12% 18%, rgba(255,255,255,0.98), transparent 32%), radial-gradient(circle at 88% 75%, rgba(250,204,21,0.25), transparent 36%)",
      }}
    >
      <BackgroundDecoration />
      {children}
    </div>
  );
}

function BrandHeader() {
  return (
    <header className="flex items-center justify-between gap-6">
      <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-md">
        <Image
          src="/logos/yellow-ribbon.png"
          alt="Yellow Ribbon Singapore"
          width={210}
          height={100}
          className="h-12 w-auto object-contain"
          priority
        />
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-md">
        <Image
          src="/logos/np.png"
          alt="Ngee Ann Polytechnic"
          width={180}
          height={80}
          className="h-10 w-auto object-contain"
          priority
        />
      </div>
    </header>
  );
}

function ProgressBar({
  label,
  percentage,
}: {
  label: string;
  percentage: number;
}) {
  return (
    <div className="min-w-44">
      <div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-wider text-neutral-500">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-black/10">
        <div
          className="h-full rounded-full bg-yellow-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function CapturedPhotosPreview({
  photos,
  layoutId,
  filterEffect,
}: {
  photos: string[];
  layoutId: LayoutId;
  filterEffect: string;
}) {
  function PhotoSlot({
    photo,
    alt,
    className,
    fit = "cover",
  }: {
    photo?: string;
    alt: string;
    className: string;
    fit?: "cover" | "contain";
  }) {
    return (
      <div className={className}>
        {photo ? (
          <Image
            src={photo}
            alt={alt}
            fill
            unoptimized
            style={{ filter: filterEffect }}
            className={
              fit === "contain" ? "object-contain p-2" : "object-cover"
            }
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
            {alt}
          </div>
        )}
      </div>
    );
  }

  if (layoutId === "strip") {
    return (
      <div className="mx-auto w-[340px] rounded-[32px] border border-yellow-200 bg-[#fffaf0] p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
            <Image
              src="/logos/yellow-ribbon.png"
              alt="Yellow Ribbon Singapore"
              width={70}
              height={28}
              className="h-7 w-auto object-contain"
            />
          </div>

          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-700">
              Second Chance
            </p>
            <p className="text-sm font-black text-neutral-900">Photo Booth</p>
          </div>

          <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
            <Image
              src="/logos/np.png"
              alt="Ngee Ann Polytechnic"
              width={64}
              height={28}
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>

        <div className="space-y-4">
          {[0, 1, 2, 3].map((index) => (
            <PhotoSlot
              key={index}
              photo={photos[index]}
              alt={`Photo ${index + 1}`}
              fit="contain"
              className="relative mx-auto aspect-square w-[220px] overflow-hidden rounded-[22px] border-[6px] border-white bg-neutral-100 shadow-md"
            />
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-white px-4 py-4 text-center shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-neutral-500">
            Everyone deserves
          </p>
          <p className="mt-1 text-xl font-black text-yellow-500">
            A Second Chance
          </p>
        </div>
      </div>
    );
  }

  if (layoutId === "grid") {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-[34px] border border-yellow-200 bg-[#fffaf0] p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-yellow-700">
              Second Chance Photo Booth
            </p>
            <h3 className="mt-1 text-2xl font-black text-neutral-900">
              Square Grid
            </h3>
          </div>

          <div className="flex gap-2">
            <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
              <Image
                src="/logos/yellow-ribbon.png"
                alt="Yellow Ribbon Singapore"
                width={72}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
              <Image
                src="/logos/np.png"
                alt="Ngee Ann Polytechnic"
                width={68}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {[0, 1, 2, 3].map((index) => (
            <PhotoSlot
              key={index}
              photo={photos[index]}
              alt={`Photo ${index + 1}`}
              className="relative aspect-square overflow-hidden rounded-[26px] border-[8px] border-white bg-neutral-100 shadow-md"
            />
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-white px-5 py-4 text-center shadow-sm">
          <p className="text-base font-semibold text-neutral-600">
            Everyone deserves a second chance.
          </p>
          <p className="mt-1 text-2xl font-black text-yellow-500">
            A Second Chance
          </p>
        </div>
      </div>
    );
  }

  if (layoutId === "polaroid") {
    return (
      <div className="mx-auto w-full max-w-3xl rounded-[34px] border border-yellow-200 bg-[#fffaf0] p-8 shadow-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-yellow-700">
              Second Chance Photo Booth
            </p>
            <h3 className="mt-1 text-2xl font-black text-neutral-900">
              Polaroid Style
            </h3>
          </div>

          <div className="flex gap-2">
            <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
              <Image
                src="/logos/yellow-ribbon.png"
                alt="Yellow Ribbon Singapore"
                width={72}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </div>
            <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
              <Image
                src="/logos/np.png"
                alt="Ngee Ann Polytechnic"
                width={68}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg rounded-[14px] bg-white p-5 pb-20 shadow-xl">
          <div className="absolute left-8 top-4 h-4 w-20 rotate-[-8deg] rounded-md bg-yellow-200/90" />
          <div className="absolute right-8 top-4 h-4 w-20 rotate-[8deg] rounded-md bg-yellow-200/90" />

          <PhotoSlot
            photo={photos[0]}
            alt="Photo 1"
            className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-neutral-100"
          />

          <div className="pt-6 text-center">
            <p className="text-sm font-semibold text-neutral-500">
              Captured with hope
            </p>
            <p className="mt-2 text-3xl font-black text-yellow-500">
              A Second Chance
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl rounded-[34px] border border-yellow-200 bg-[#fffaf0] p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-yellow-700">
            Second Chance Photo Booth
          </p>
          <h3 className="mt-1 text-2xl font-black text-neutral-900">
            Event Exclusive
          </h3>
        </div>

        <div className="flex gap-2">
          <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
            <Image
              src="/logos/yellow-ribbon.png"
              alt="Yellow Ribbon Singapore"
              width={72}
              height={28}
              className="h-7 w-auto object-contain"
            />
          </div>
          <div className="rounded-xl bg-white px-3 py-2 shadow-sm">
            <Image
              src="/logos/np.png"
              alt="Ngee Ann Polytechnic"
              width={68}
              height={28}
              className="h-7 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1.35fr_1fr] gap-5">
        <PhotoSlot
          photo={photos[0]}
          alt="Photo 1"
          className="relative min-h-[430px] overflow-hidden rounded-[28px] border-[8px] border-white bg-neutral-100 shadow-md"
        />

        <div className="grid gap-5">
          <PhotoSlot
            photo={photos[1]}
            alt="Photo 2"
            className="relative min-h-[205px] overflow-hidden rounded-[24px] border-[8px] border-white bg-neutral-100 shadow-md"
          />
          <PhotoSlot
            photo={photos[2]}
            alt="Photo 3"
            className="relative min-h-[205px] overflow-hidden rounded-[24px] border-[8px] border-white bg-neutral-100 shadow-md"
          />
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white px-5 py-4 text-center shadow-sm">
        <p className="text-base font-semibold text-neutral-600">
          Celebrate hope, growth and new beginnings.
        </p>
        <p className="mt-1 text-2xl font-black text-yellow-500">
          A Second Chance
        </p>
      </div>
    </div>
  );
}

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load image: ${src}`));
    image.src = src;
  });
}

function roundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height,
  );
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(
    width / image.naturalWidth,
    height / image.naturalHeight,
  );
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  const sourceY = (image.naturalHeight - sourceHeight) / 2;

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    width,
    height,
  );
}

function drawImageContain(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.min(
    width / image.naturalWidth,
    height / image.naturalHeight,
  );
  const imageWidth = image.naturalWidth * scale;
  const imageHeight = image.naturalHeight * scale;

  context.drawImage(
    image,
    x + (width - imageWidth) / 2,
    y + (height - imageHeight) / 2,
    imageWidth,
    imageHeight,
  );
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maximumWidth: number,
  lineHeight: number,
) {
  const words = text.trim().split(/\s+/);
  let currentLine = "";
  let currentY = y;

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;

    if (context.measureText(testLine).width > maximumWidth && currentLine) {
      context.fillText(currentLine, x, currentY);
      currentLine = word;
      currentY += lineHeight;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    context.fillText(currentLine, x, currentY);
  }
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedLayout, setSelectedLayout] = useState<LayoutId>("strip");
  const [selectedFilter, setSelectedFilter] = useState<FilterId>("original");
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [cameraAttempt, setCameraAttempt] = useState(0);
  const [keepsakeMessage, setKeepsakeMessage] = useState(
    "Everyone deserves a second chance.",
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  const selectedFilterOption =
    filterOptions.find((filter) => filter.id === selectedFilter) ??
    filterOptions[0];

  const selectedOption =
    layoutOptions.find((layout) => layout.id === selectedLayout) ??
    layoutOptions[0];

  useEffect(() => {
    if (screen !== "camera") {
      return;
    }

    let stream: MediaStream | null = null;
    let cancelled = false;

    async function startCamera() {
      setCameraError("");

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera access is not supported in this browser.");
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        console.error(error);
        setCameraError(
          "Camera access was blocked or no camera was found. Please allow camera permission, try again or upload photos instead.",
        );
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [screen, cameraAttempt]);

  async function takePhoto() {
    if (
      countdown !== null ||
      cameraError ||
      capturedPhotos.length >= selectedOption.shots
    ) {
      return;
    }

    for (let number = 3; number >= 1; number -= 1) {
      setCountdown(number);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setCountdown(null);

    const video = videoRef.current;

    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setCameraError("The camera is still loading. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Unable to capture the photo. Please try again.");
      return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photo = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedPhotos((currentPhotos) => [...currentPhotos, photo]);
  }

  async function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length !== selectedOption.shots) {
      setCameraError(
        `Please select exactly ${selectedOption.shots} photo${
          selectedOption.shots === 1 ? "" : "s"
        }.`,
      );
      event.target.value = "";
      return;
    }

    try {
      const uploadedPhotos = await Promise.all(
        selectedFiles.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(String(reader.result));
              reader.onerror = () =>
                reject(new Error("Unable to read the photo."));
              reader.readAsDataURL(file);
            }),
        ),
      );

      setCapturedPhotos(uploadedPhotos);
      setCameraError("");
      setScreen("review");
    } catch (error) {
      console.error(error);
      setCameraError(
        "One or more photos could not be uploaded. Please try again.",
      );
    } finally {
      event.target.value = "";
    }
  }

  async function downloadKeepsake() {
    if (capturedPhotos.length < selectedOption.shots) {
      setDownloadError("The required photos have not been captured yet.");
      return;
    }

    setIsDownloading(true);
    setDownloadError("");

    try {
      const canvas = document.createElement("canvas");
      const isStrip = selectedLayout === "strip";

      canvas.width = isStrip ? 1000 : 1400;
      canvas.height = isStrip ? 2350 : 1700;

      const possibleContext = canvas.getContext("2d");

      if (!possibleContext) {
        throw new Error("Canvas is unavailable.");
      }

      const context: CanvasRenderingContext2D = possibleContext;

      const photoImages = await Promise.all(
        capturedPhotos.map(loadCanvasImage),
      );

      const [yellowRibbonLogo, npLogo] = await Promise.all([
        loadCanvasImage("/logos/yellow-ribbon.png"),
        loadCanvasImage("/logos/np.png"),
      ]);

      const safeMessage =
        keepsakeMessage.trim() || "Everyone deserves a second chance.";
      const timestamp = new Date().toLocaleString();

      const colors = {
        background: "#fdf8e7",
        card: "#fffaf0",
        ink: "#171717",
        softText: "#6b6b6b",
        yellowDeep: "#e0ad00",
        border: "#f1dfaa",
      };

      function fillRoundedRect(
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        fill: string,
      ) {
        context.save();
        context.fillStyle = fill;
        roundedRectPath(context, x, y, width, height, radius);
        context.fill();
        context.restore();
      }

      function strokeRoundedRect(
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        stroke: string,
        lineWidth = 1,
      ) {
        context.save();
        context.strokeStyle = stroke;
        context.lineWidth = lineWidth;
        roundedRectPath(context, x, y, width, height, radius);
        context.stroke();
        context.restore();
      }

      function drawLogoChip(
        image: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number,
      ) {
        fillRoundedRect(x, y, width, height, 20, "rgba(255,255,255,0.92)");
        drawImageContain(
          context,
          image,
          x + 14,
          y + 10,
          width - 28,
          height - 20,
        );
      }

      function drawPill(
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
        fill = "#fff2bf",
        textColor = "#8a6800",
      ) {
        fillRoundedRect(x, y, width, height, height / 2, fill);
        context.save();
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = textColor;
        context.font = "700 18px Arial";
        context.fillText(text, x + width / 2, y + height / 2 + 1);
        context.restore();
      }

      function drawPhotoCard(
        image: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number,
        radius = 28,
      ) {
        context.save();
        context.shadowColor = "rgba(0, 0, 0, 0.14)";
        context.shadowBlur = 22;
        context.shadowOffsetY = 10;
        context.fillStyle = "#ffffff";
        roundedRectPath(
          context,
          x - 8,
          y - 8,
          width + 16,
          height + 16,
          radius + 6,
        );
        context.fill();
        context.restore();

        context.save();
        roundedRectPath(context, x, y, width, height, radius);
        context.clip();
        context.filter = selectedFilterOption.effect;
        drawImageCover(context, image, x, y, width, height);
        context.restore();
        context.filter = "none";
      }

      function drawPhotoCardContain(
        image: HTMLImageElement,
        x: number,
        y: number,
        width: number,
        height: number,
        radius = 24,
      ) {
        context.save();
        context.shadowColor = "rgba(0, 0, 0, 0.14)";
        context.shadowBlur = 22;
        context.shadowOffsetY = 10;
        context.fillStyle = "#ffffff";
        roundedRectPath(
          context,
          x - 8,
          y - 8,
          width + 16,
          height + 16,
          radius + 6,
        );
        context.fill();
        context.restore();

        context.save();
        roundedRectPath(context, x, y, width, height, radius);
        context.clip();
        context.fillStyle = "#f7f7f7";
        context.fillRect(x, y, width, height);
        context.filter = selectedFilterOption.effect;
        drawImageContain(
          context,
          image,
          x + 12,
          y + 12,
          width - 24,
          height - 24,
        );
        context.restore();
        context.filter = "none";
      }

      context.fillStyle = colors.background;
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.save();
      context.globalAlpha = 0.25;
      context.fillStyle = "#f8df77";
      context.beginPath();
      context.arc(canvas.width - 80, 120, 180, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.arc(60, canvas.height - 120, 170, 0, Math.PI * 2);
      context.fill();
      context.restore();

      drawLogoChip(yellowRibbonLogo, 46, 34, 180, 72);
      drawLogoChip(npLogo, canvas.width - 226, 34, 180, 72);

      context.save();
      context.textAlign = "center";
      context.fillStyle = colors.ink;
      context.font = `900 ${isStrip ? 36 : 50}px Arial`;
      context.fillText(
        "SECOND CHANCE PHOTO BOOTH",
        canvas.width / 2,
        isStrip ? 155 : 170,
      );
      context.fillStyle = colors.softText;
      context.font = `700 ${isStrip ? 18 : 22}px Arial`;
      context.fillText(
        selectedOption.name,
        canvas.width / 2,
        isStrip ? 188 : 205,
      );
      context.restore();

      let footerStartY = isStrip ? 2100 : 1360;

      if (selectedLayout === "strip") {
        const cardX = 250;
        const cardY = 225;
        const cardW = 500;
        const cardH = 1860;

        fillRoundedRect(cardX, cardY, cardW, cardH, 34, colors.card);
        strokeRoundedRect(cardX, cardY, cardW, cardH, 34, colors.border, 2);
        drawPill("Classic Strip", cardX + 125, cardY + 26, 250, 42);

        const photoX = cardX + 90;
        const photoW = 320;
        const photoH = 320;
        const startY = cardY + 110;
        const gap = 24;

        [0, 1, 2, 3].forEach((index) => {
          if (photoImages[index]) {
            drawPhotoCardContain(
              photoImages[index],
              photoX,
              startY + index * (photoH + gap),
              photoW,
              photoH,
              24,
            );
          }
        });

        fillRoundedRect(
          cardX + 42,
          cardY + 1510,
          cardW - 84,
          95,
          24,
          "#ffffff",
        );

        context.save();
        context.textAlign = "center";
        context.fillStyle = colors.softText;
        context.font = "700 18px Arial";
        context.fillText("Captured with hope", canvas.width / 2, cardY + 1552);
        context.fillStyle = colors.yellowDeep;
        context.font = "900 34px Arial";
        context.fillText("A Second Chance", canvas.width / 2, cardY + 1590);
        context.restore();

        drawPill(
          timestamp,
          cardX + 100,
          cardY + 1640,
          300,
          38,
          "#1f1f1f",
          "#ffffff",
        );

        footerStartY = 2100;
      }

      if (selectedLayout === "grid") {
        const cardX = 70;
        const cardY = 250;
        const cardW = 1260;
        const cardH = 980;

        fillRoundedRect(cardX, cardY, cardW, cardH, 36, colors.card);
        strokeRoundedRect(cardX, cardY, cardW, cardH, 36, colors.border, 2);
        drawPill("Square Grid", cardX + 70, cardY + 36, 220, 44);

        const photoSize = 500;
        const gapX = 52;
        const gapY = 46;
        const startX = cardX + 104;
        const startY = cardY + 120;

        [0, 1, 2, 3].forEach((index) => {
          const column = index % 2;
          const row = Math.floor(index / 2);

          if (photoImages[index]) {
            drawPhotoCard(
              photoImages[index],
              startX + column * (photoSize + gapX),
              startY + row * (photoSize / 1.45 + gapY),
              photoSize,
              photoSize / 1.45,
              28,
            );
          }
        });

        drawPill(
          timestamp,
          cardX + cardW - 300,
          cardY + 36,
          230,
          44,
          "#1f1f1f",
          "#ffffff",
        );

        footerStartY = 1360;
      }

      if (selectedLayout === "polaroid") {
        const cardX = 110;
        const cardY = 250;
        const cardW = 1180;
        const cardH = 980;

        fillRoundedRect(cardX, cardY, cardW, cardH, 36, colors.card);
        strokeRoundedRect(cardX, cardY, cardW, cardH, 36, colors.border, 2);
        drawPill("Polaroid Style", cardX + 70, cardY + 36, 240, 44);

        const frameX = 320;
        const frameY = 330;
        const frameW = 760;
        const frameH = 760;

        context.save();
        context.shadowColor = "rgba(0,0,0,0.16)";
        context.shadowBlur = 30;
        context.shadowOffsetY = 14;
        context.fillStyle = "#ffffff";
        roundedRectPath(context, frameX, frameY, frameW, frameH, 12);
        context.fill();
        context.restore();

        fillRoundedRect(frameX - 18, frameY + 10, 120, 18, 6, "#f9e395");
        fillRoundedRect(
          frameX + frameW - 102,
          frameY + 10,
          120,
          18,
          6,
          "#f9e395",
        );

        if (photoImages[0]) {
          drawPhotoCard(
            photoImages[0],
            frameX + 34,
            frameY + 34,
            frameW - 68,
            520,
            8,
          );
        }

        context.save();
        context.textAlign = "center";
        context.fillStyle = colors.softText;
        context.font = "700 24px Arial";
        context.fillText(
          "Captured with hope",
          frameX + frameW / 2,
          frameY + 618,
        );
        context.fillStyle = colors.yellowDeep;
        context.font = "900 48px Arial";
        context.fillText("A Second Chance", frameX + frameW / 2, frameY + 680);
        context.restore();

        drawPill(
          timestamp,
          frameX + 185,
          frameY + 710,
          390,
          40,
          "#1f1f1f",
          "#ffffff",
        );

        footerStartY = 1365;
      }

      if (selectedLayout === "event") {
        const cardX = 70;
        const cardY = 250;
        const cardW = 1260;
        const cardH = 1020;

        fillRoundedRect(cardX, cardY, cardW, cardH, 36, colors.card);
        strokeRoundedRect(cardX, cardY, cardW, cardH, 36, colors.border, 2);
        drawPill("Event Exclusive", cardX + 70, cardY + 36, 250, 44);

        if (photoImages[0]) {
          drawPhotoCard(photoImages[0], 120, 340, 670, 760, 28);
        }
        if (photoImages[1]) {
          drawPhotoCard(photoImages[1], 840, 340, 420, 340, 26);
        }
        if (photoImages[2]) {
          drawPhotoCard(photoImages[2], 840, 760, 420, 340, 26);
        }

        fillRoundedRect(840, 1120, 420, 96, 24, "#ffffff");
        context.save();
        context.textAlign = "center";
        context.fillStyle = colors.softText;
        context.font = "700 18px Arial";
        context.fillText("Celebrate hope and new beginnings", 1050, 1160);
        context.fillStyle = colors.yellowDeep;
        context.font = "900 32px Arial";
        context.fillText("A Second Chance", 1050, 1196);
        context.restore();

        footerStartY = 1390;
      }

      context.save();
      context.textAlign = "center";
      context.fillStyle = colors.ink;
      context.font = `700 ${isStrip ? 34 : 40}px Arial`;
      drawWrappedText(
        context,
        safeMessage,
        canvas.width / 2,
        footerStartY,
        isStrip ? 760 : 1080,
        isStrip ? 42 : 48,
      );
      context.fillStyle = colors.yellowDeep;
      context.font = `900 ${isStrip ? 60 : 74}px Arial`;
      context.fillText(
        "A SECOND CHANCE",
        canvas.width / 2,
        footerStartY + (isStrip ? 120 : 140),
      );
      context.fillStyle = colors.softText;
      context.font = `600 ${isStrip ? 20 : 24}px Arial`;
      context.fillText(
        "Yellow Ribbon Singapore × Ngee Ann Polytechnic",
        canvas.width / 2,
        footerStartY + (isStrip ? 180 : 210),
      );
      context.font = `600 ${isStrip ? 16 : 18}px Arial`;
      context.fillText(
        timestamp,
        canvas.width / 2,
        footerStartY + (isStrip ? 210 : 240),
      );
      context.restore();

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((createdBlob) => {
          if (createdBlob) {
            resolve(createdBlob);
          } else {
            reject(new Error("Unable to create the download."));
          }
        }, "image/png");
      });

      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = `second-chance-${selectedLayout}-keepsake.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error(error);
      setDownloadError(
        "The keepsake could not be generated. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  }

  function startNewSession() {
    setCapturedPhotos([]);
    setSelectedLayout("strip");
    setSelectedFilter("original");
    setCountdown(null);
    setCameraError("");
    setKeepsakeMessage("Everyone deserves a second chance.");
    setDownloadError("");
    setScreen("home");
  }

  if (screen === "camera") {
    const remainingPhotos = selectedOption.shots - capturedPhotos.length;
    const captureComplete = remainingPhotos === 0;

    return (
      <PageBackground>
        <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-12">
          <BrandHeader />

          <section className="flex flex-1 flex-col justify-center py-8">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
              <div>
                <button
                  type="button"
                  disabled={countdown !== null}
                  onClick={() => {
                    setCapturedPhotos([]);
                    setCameraError("");
                    setScreen("layouts");
                  }}
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span aria-hidden="true">←</span>
                  Back
                </button>

                <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-yellow-700">
                  Step 2 of 4
                </p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Take your photos
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                  Look at the camera and get ready. Each photo starts with a
                  three-second countdown.
                </p>
              </div>

              <ProgressBar label="Photos" percentage={50} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="relative overflow-hidden rounded-[32px] border-4 border-white bg-neutral-950 shadow-2xl">
                <div className="relative aspect-video min-h-96">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{ filter: selectedFilterOption.effect }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {!cameraError && (
                    <div className="pointer-events-none absolute inset-6 rounded-[24px] border-2 border-white/60" />
                  )}

                  {countdown !== null && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                      <span className="animate-pulse text-[160px] font-black text-yellow-400">
                        {countdown}
                      </span>
                    </div>
                  )}

                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 p-8 text-center text-white">
                      <div className="mb-5 text-6xl">📷</div>
                      <h2 className="text-2xl font-black">
                        Camera unavailable
                      </h2>
                      <p className="mt-3 max-w-md leading-7 text-neutral-300">
                        {cameraError}
                      </p>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={() =>
                            setCameraAttempt((attempt) => attempt + 1)
                          }
                          className="rounded-full bg-yellow-400 px-7 py-3 font-black text-neutral-950"
                        >
                          Try Camera Again
                        </button>

                        <label className="cursor-pointer rounded-full border-2 border-white px-7 py-3 font-black text-white transition hover:bg-white hover:text-neutral-950">
                          Upload {selectedOption.shots} Photo
                          {selectedOption.shots === 1 ? "" : "s"} Instead
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            multiple={selectedOption.shots > 1}
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <aside className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-lg backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Selected layout
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {selectedOption.name}
                </h2>

                <div className="my-5 flex justify-center rounded-2xl bg-neutral-100 p-5">
                  <LayoutPreview layoutId={selectedLayout} />
                </div>

                <div className="mb-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                      Choose a filter
                    </p>
                    <p className="text-xs font-bold text-yellow-600">
                      {selectedFilterOption.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.map((filter) => {
                      const active = selectedFilter === filter.id;

                      return (
                        <button
                          key={filter.id}
                          type="button"
                          disabled={countdown !== null}
                          onClick={() => setSelectedFilter(filter.id)}
                          className={`rounded-xl border px-3 py-3 text-sm font-black transition ${
                            active
                              ? "border-yellow-400 bg-yellow-400 text-neutral-950"
                              : "border-neutral-200 bg-white text-neutral-700 hover:border-yellow-400"
                          } disabled:cursor-not-allowed disabled:opacity-50`}
                        >
                          {filter.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-5 rounded-2xl bg-yellow-100 p-4 text-center">
                  <p className="text-sm font-bold text-yellow-800">
                    {captureComplete
                      ? "All photos captured!"
                      : `${remainingPhotos} photo${
                          remainingPhotos === 1 ? "" : "s"
                        } remaining`}
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {capturedPhotos.length} / {selectedOption.shots}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: selectedOption.shots }).map(
                    (_, index) => {
                      const photo = capturedPhotos[index];

                      return (
                        <div
                          key={index}
                          className="relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
                        >
                          {photo ? (
                            <Image
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              fill
                              unoptimized
                              style={{ filter: selectedFilterOption.effect }}
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs font-bold text-neutral-400">
                              PHOTO {index + 1}
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </aside>
            </div>

            <div className="mt-7 flex flex-col justify-between gap-4 rounded-3xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center">
              <div>
                <p className="font-black">
                  {captureComplete
                    ? "Your photos are ready to review."
                    : "Smile and look directly at the camera."}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  {captureComplete
                    ? "Review them before creating your final keepsake."
                    : "Press the button when everyone is ready."}
                </p>
              </div>

              {captureComplete ? (
                <button
                  type="button"
                  onClick={() => setScreen("review")}
                  className="min-h-14 rounded-full bg-neutral-950 px-9 py-4 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-yellow-400 hover:text-neutral-950"
                >
                  Review Photos →
                </button>
              ) : (
                <button
                  type="button"
                  disabled={countdown !== null || Boolean(cameraError)}
                  onClick={takePhoto}
                  className="min-h-14 rounded-full bg-yellow-400 px-9 py-4 font-black text-neutral-950 shadow-lg transition hover:-translate-y-1 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {countdown !== null
                    ? "Get Ready..."
                    : `Take Photo ${capturedPhotos.length + 1}`}
                </button>
              )}
            </div>
          </section>
        </main>
      </PageBackground>
    );
  }

  if (screen === "download") {
    return (
      <PageBackground>
        <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-12">
          <BrandHeader />

          <section className="flex flex-1 flex-col justify-center py-8">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
              <div>
                <button
                  type="button"
                  onClick={() => setScreen("review")}
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span aria-hidden="true">←</span>
                  Back
                </button>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-yellow-700">
                  Step 4 of 4
                </p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Download your keepsake
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                  Add a short message and save your completed Yellow Ribbon
                  photo keepsake.
                </p>
              </div>

              <ProgressBar label="Complete" percentage={100} />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="rounded-[32px] border border-white/80 bg-white/65 p-6 shadow-xl backdrop-blur-xl sm:p-10">
                <CapturedPhotosPreview
                  photos={capturedPhotos}
                  layoutId={selectedLayout}
                  filterEffect={selectedFilterOption.effect}
                />

                <div className="mx-auto mt-7 max-w-2xl text-center">
                  <p className="text-lg font-semibold text-neutral-600">
                    {keepsakeMessage || "Everyone deserves a second chance."}
                  </p>
                  <p className="mt-2 text-3xl font-black text-yellow-500">
                    A Second Chance
                  </p>
                </div>
              </div>

              <aside className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-lg backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Final keepsake
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {selectedOption.name}
                </h2>
                <p className="mt-1 text-sm font-semibold text-yellow-700">
                  Filter: {selectedFilterOption.name}
                </p>

                <label
                  htmlFor="keepsake-message"
                  className="mt-7 block text-sm font-black"
                >
                  Keepsake message
                </label>
                <textarea
                  id="keepsake-message"
                  value={keepsakeMessage}
                  maxLength={90}
                  rows={4}
                  onChange={(event) => setKeepsakeMessage(event.target.value)}
                  className="mt-2 w-full resize-none rounded-2xl border border-neutral-300 bg-white p-4 leading-6 outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-200"
                  placeholder="Enter a short message..."
                />
                <p className="mt-2 text-right text-xs font-semibold text-neutral-400">
                  {keepsakeMessage.length} / 90
                </p>

                {downloadError && (
                  <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
                    {downloadError}
                  </p>
                )}

                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={downloadKeepsake}
                  className="mt-6 min-h-14 w-full rounded-full bg-yellow-400 px-7 py-4 font-black text-neutral-950 shadow-lg transition hover:-translate-y-1 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDownloading ? "Creating Keepsake..." : "Download PNG ↓"}
                </button>

                <button
                  type="button"
                  onClick={startNewSession}
                  className="mt-3 min-h-12 w-full rounded-full border-2 border-neutral-950 bg-white px-7 py-3 font-black text-neutral-950 transition hover:bg-neutral-950 hover:text-white"
                >
                  Start New Session
                </button>

                <p className="mt-5 text-center text-xs leading-5 text-neutral-500">
                  Photos are processed inside this browser and are not
                  automatically uploaded.
                </p>
              </aside>
            </div>
          </section>
        </main>
      </PageBackground>
    );
  }

  if (screen === "review") {
    return (
      <PageBackground>
        <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-12">
          <BrandHeader />

          <section className="flex flex-1 flex-col justify-center py-8">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
              <div>
                <button
                  type="button"
                  onClick={() => setScreen("camera")}
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span aria-hidden="true">←</span>
                  Back
                </button>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-yellow-700">
                  Step 3 of 4
                </p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Review your photos
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                  Check that everyone is happy before creating the final
                  keepsake.
                </p>
              </div>

              <ProgressBar label="Review" percentage={75} />
            </div>

            <div className="rounded-[32px] border border-white/80 bg-white/65 p-6 shadow-xl backdrop-blur-xl sm:p-10">
              <CapturedPhotosPreview
                photos={capturedPhotos}
                layoutId={selectedLayout}
                filterEffect={selectedFilterOption.effect}
              />
            </div>

            <div className="mt-7 flex flex-col justify-between gap-4 rounded-3xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center">
              <div>
                <p className="font-black">Happy with your photos?</p>
                <p className="mt-1 text-sm text-neutral-500">
                  You can retake all photos before continuing.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setCapturedPhotos([]);
                    setCameraError("");
                    setScreen("camera");
                  }}
                  className="min-h-14 rounded-full border-2 border-neutral-950 bg-white px-7 py-4 font-black text-neutral-950 transition hover:-translate-y-1"
                >
                  Retake All
                </button>

                <button
                  type="button"
                  onClick={() => setScreen("download")}
                  className="min-h-14 rounded-full bg-neutral-950 px-8 py-4 font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-yellow-400 hover:text-neutral-950"
                >
                  Create Keepsake →
                </button>
              </div>
            </div>
          </section>
        </main>
      </PageBackground>
    );
  }

  if (screen === "layouts") {
    return (
      <PageBackground>
        <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-12">
          <BrandHeader />

          <section className="flex flex-1 flex-col justify-center py-8">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
              <div>
                <button
                  type="button"
                  onClick={() => setScreen("home")}
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span aria-hidden="true">←</span>
                  Back
                </button>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.28em] text-yellow-700">
                  Step 1 of 4
                </p>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Choose your layout
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                  Select how you would like your photos to appear in the final
                  keepsake.
                </p>
              </div>

              <ProgressBar label="Layout" percentage={25} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {layoutOptions.map((layout) => {
                const selected = selectedLayout === layout.id;

                return (
                  <button
                    type="button"
                    key={layout.id}
                    aria-pressed={selected}
                    onClick={() => setSelectedLayout(layout.id)}
                    className={`group relative flex min-h-72 flex-col rounded-[28px] border p-5 text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl ${
                      selected
                        ? "border-yellow-500 bg-yellow-50 ring-4 ring-yellow-300/50"
                        : "border-white/80 bg-white/75 backdrop-blur-xl"
                    }`}
                  >
                    <div className="flex flex-1 items-center justify-center rounded-2xl bg-neutral-100/80 p-5">
                      <LayoutPreview layoutId={layout.id} />
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-black">{layout.name}</h2>
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-black ${
                            selected
                              ? "border-yellow-500 bg-yellow-400 text-neutral-950"
                              : "border-neutral-300 bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        {layout.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/70 p-5 shadow-sm backdrop-blur-xl sm:flex-row">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Selected layout
                </p>
                <p className="mt-1 text-xl font-black">{selectedOption.name}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCapturedPhotos([]);
                  setCameraError("");
                  setDownloadError("");
                  setScreen("camera");
                }}
                className="min-h-14 w-full rounded-full bg-neutral-950 px-8 py-4 text-base font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-yellow-400 hover:text-neutral-950 sm:w-auto"
              >
                Confirm Layout →
              </button>
            </div>
          </section>
        </main>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-12">
        <BrandHeader />

        <section className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-yellow-400/40 bg-white/70 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur-md">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              Yellow Ribbon Event Experience
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              SECOND
              <span className="block text-yellow-500">CHANCE</span>
              <span className="block text-4xl tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                PHOTO BOOTH
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-neutral-600 sm:text-xl">
              Capture a memory. Support reintegration. Celebrate hope and the
              power of new beginnings.
            </p>

            <button
              type="button"
              onClick={() => setScreen("layouts")}
              className="group mt-9 inline-flex min-h-16 items-center justify-center gap-4 rounded-full bg-neutral-950 px-10 py-5 text-lg font-black text-white shadow-2xl transition duration-300 hover:-translate-y-1 hover:bg-yellow-400 hover:text-neutral-950"
            >
              Start Photo Booth
              <span
                aria-hidden="true"
                className="text-2xl transition-transform group-hover:translate-x-2"
              >
                →
              </span>
            </button>

            <p className="mt-5 text-sm font-medium text-neutral-500">
              Touch START to begin your experience.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rotate-3 rounded-[40px] bg-yellow-300/50 blur-sm" />

            <div className="relative -rotate-2 rounded-[36px] border border-white bg-white/85 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-700">
                    Your keepsake
                  </p>
                  <p className="mt-1 text-lg font-black">
                    A memory with meaning
                  </p>
                </div>

                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
                </div>
              </div>

              <div className="mx-auto w-52 rounded-2xl bg-white p-3 shadow-xl">
                <div className="grid gap-2">
                  {[1, 2, 3, 4].map((photo) => (
                    <div
                      key={photo}
                      className="flex h-24 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-100 via-neutral-50 to-yellow-200"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                        Photo {photo}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="px-2 pb-2 pt-4 text-center">
                  <p className="text-xs font-black uppercase tracking-[0.18em]">
                    Everyone deserves
                  </p>
                  <p className="text-lg font-black text-yellow-500">
                    A Second Chance
                  </p>
                </div>
              </div>

              <p className="mt-5 text-center text-sm font-semibold text-neutral-500">
                Choose a layout, take your photos and download your personalised
                keepsake.
              </p>
            </div>
          </div>
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-neutral-900/10 py-4 text-xs font-semibold text-neutral-500 sm:flex-row">
          <p>Second Chance Photo Booth</p>
          <p>Powered by Ngee Ann Polytechnic</p>
        </footer>
      </main>
    </PageBackground>
  );
}