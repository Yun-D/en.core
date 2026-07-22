import Drawer from "./Drawer";

interface ReceiptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReceiptDrawer = ({ isOpen, onClose }: ReceiptDrawerProps) => {
  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div></div>
    </Drawer>
  );
};

export default ReceiptDrawer;
