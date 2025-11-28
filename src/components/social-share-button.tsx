"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { Share2, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ShareTemplate, ShareTemplateProps } from "./share-template";

interface SocialShareButtonProps extends ShareTemplateProps {
  buttonLabel?: string;
  className?: string;
}

export function SocialShareButton({
  buttonLabel = "Share Plan",
  className,
  ...templateProps
}: SocialShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const templateRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!templateRef.current) return;

    try {
      setIsGenerating(true);
      
      // Wait for a moment to ensure rendering
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(templateRef.current, {
        scale: 2, // High resolution
        backgroundColor: null, // Transparent background if needed, but template has bg
        logging: false,
        useCORS: true, // If using external images
      });

      const image = canvas.toDataURL("image/png");
      setGeneratedImage(image);
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleShare}
        variant="outline"
        className={className}
        disabled={isGenerating}
      >
        <Share2 className="mr-2 h-4 w-4" />
        {isGenerating ? "Generating..." : buttonLabel}
      </Button>

      {/* Hidden Template for Capture */}
      <div className="fixed left-[-9999px] top-0">
        <ShareTemplate ref={templateRef} {...templateProps} />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>แผนซ้อมพร้อมแชร์!</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4 py-4">
            {generatedImage && (
              <div className="relative rounded-lg overflow-hidden shadow-lg border">
                <img
                  src={generatedImage}
                  alt="Training Plan"
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center">
              แตะค้างที่รูปเพื่อบันทึก หรือส่งต่อ
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
            {generatedImage && (
              <Button asChild>
                <a href={generatedImage} download="smart-race-pacer-plan.png">
                  <Download className="mr-2 h-4 w-4" />
                  Save Image
                </a>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
