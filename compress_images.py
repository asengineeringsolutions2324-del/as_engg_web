import os
import shutil
import sys
import subprocess

def install_and_import(package):
    try:
        import PIL
    except ImportError:
        print(f"Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
    finally:
        from PIL import Image
        return Image

def update_html_files(base_dir):
    for filename in ["Products.html", "index.html"]:
        file_path = os.path.join(base_dir, filename)
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
        
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace only if it doesn't already have loading="lazy"
        target = 'src="images/product/'
        replacement = 'loading="lazy" src="images/product/'
        
        # Avoid duplicate lazy loading attributes by restoring first, then applying
        content = content.replace(replacement, target)
        content = content.replace(target, replacement)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Successfully updated {filename} with lazy loading for product images.")

def main():
    # Define directories
    base_dir = os.path.dirname(os.path.abspath(__file__))
    product_dir = os.path.join(base_dir, "images", "product")
    backup_dir = os.path.join(base_dir, "images", "product_backup")

    if not os.path.exists(product_dir):
        print(f"Error: Product directory not found at {product_dir}")
        return

    # 1. Create Backup
    if not os.path.exists(backup_dir):
        print(f"Creating backup directory at {backup_dir}...")
        shutil.copytree(product_dir, backup_dir)
        print("Backup created successfully.")
    else:
        print(f"Backup already exists at {backup_dir}. Skipping backup step.")

    # 2. Install/Import Pillow
    Image = install_and_import("Pillow")

    # 3. Compress Images
    files = [f for f in os.listdir(product_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    print(f"Found {len(files)} images to compress.")

    total_orig_size = 0
    total_new_size = 0

    max_size = 800  # max width or height
    quality = 80    # JPEG quality

    for filename in files:
        file_path = os.path.join(product_dir, filename)
        orig_size = os.path.getsize(file_path)
        total_orig_size += orig_size

        try:
            with Image.open(file_path) as img:
                # Check dimensions and resize if necessary
                width, height = img.size
                if width > max_size or height > max_size:
                    if width > height:
                        new_width = max_size
                        new_height = int(height * (max_size / width))
                    else:
                        new_height = max_size
                        new_width = int(width * (max_size / height))
                    
                    print(f"Resizing {filename} from {width}x{height} to {new_width}x{new_height}")
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Determine target format based on file extension to avoid Pillow save format mismatches
                ext = filename.lower()
                if ext.endswith(('.jpg', '.jpeg')):
                    if img.mode != "RGB":
                        img = img.convert("RGB")
                    img.save(file_path, format="JPEG", quality=quality, optimize=True)
                elif ext.endswith('.png'):
                    img.save(file_path, format="PNG", optimize=True)
                else:
                    img.save(file_path, optimize=True)

            new_size = os.path.getsize(file_path)
            total_new_size += new_size
            reduction = (orig_size - new_size) / orig_size * 100
            print(f"Compressed {filename}: {orig_size/1024:.1f}KB -> {new_size/1024:.1f}KB ({reduction:.1f}% reduction)")
        except Exception as e:
            print(f"Failed to compress {filename}: {e}")

    print("\n--- Summary ---")
    print(f"Total Original Size: {total_orig_size/1024/1024:.2f} MB")
    print(f"Total Optimized Size: {total_new_size/1024/1024:.2f} MB")
    if total_orig_size > 0:
        overall_reduction = (total_orig_size - total_new_size) / total_orig_size * 100
        print(f"Overall Reduction: {overall_reduction:.1f}%")

    # 4. Update HTML files
    print("\nUpdating HTML files with lazy loading...")
    update_html_files(base_dir)

if __name__ == "__main__":
    main()
