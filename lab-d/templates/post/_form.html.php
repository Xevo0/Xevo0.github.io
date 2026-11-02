
<?php
/** @var $post ?\App\Model\Post */
/** @var \App\Model\Category[] $categories */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="post[subject]"
           value="<?= htmlspecialchars($post ? ($post->getSubject() ?? '') : '', ENT_QUOTES, 'UTF-8') ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="post[content]"><?= htmlspecialchars($post ? ($post->getContent() ?? '') : '', ENT_QUOTES, 'UTF-8') ?></textarea>
</div>

<div class="form-group">
    <label for="category">Category</label>
    <select id="category" name="post[category_id]">
        <option value="">Without category</option>

        <?php foreach ($categories as $category): ?>
            <option value="<?= $category->getId() ?>"
                    <?= $post->getCategoryId() === $category->getId() ? 'selected' : '' ?>>
                <?= htmlspecialchars($category->getName() ?? '', ENT_QUOTES, 'UTF-8') ?>
            </option>
        <?php endforeach; ?>
    </select>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
